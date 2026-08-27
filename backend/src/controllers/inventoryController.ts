import { Request, Response, NextFunction } from 'express';
import { InventoryItem, InventoryTransaction } from '../models';
import { AuthenticatedRequest } from '../middleware/auth';
import { getIO } from '../sockets';

export const getInventoryItems = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, status, search } = req.query;

    const query: any = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [{ nameBn: regex }, { nameEn: regex }, { supplier: regex }];
    }

    const items = await InventoryItem.find(query).sort({ status: 1, currentStock: 1 });
    const lowStockCount = await InventoryItem.countDocuments({ status: { $in: ['low_stock', 'out_of_stock'] } });

    res.status(200).json({
      success: true,
      count: items.length,
      lowStockCount,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const createInventoryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await InventoryItem.create({
      ...req.body,
      lastRestockedDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'ইনভেন্টরি আইটেম যোগ হয়েছে / Inventory item added',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await InventoryItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      res.status(404).json({ success: false, message: 'ইনভেন্টরি আইটেম পাওয়া যায়নি / Item not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'আপডেট হয়েছে / Item updated', data: item });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { type, quantity, unitCost, reason, referenceId } = req.body;

    const item = await InventoryItem.findById(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }

    const previousStock = item.currentStock;
    let newStock = previousStock;

    if (type === 'purchase' || type === 'return') {
      newStock = previousStock + Math.abs(quantity);
      item.lastRestockedDate = new Date();
    } else if (type === 'waste' || type === 'order_consumption') {
      newStock = Math.max(0, previousStock - Math.abs(quantity));
    } else if (type === 'adjustment') {
      newStock = Math.max(0, previousStock + quantity);
    }

    item.currentStock = newStock;
    if (unitCost) {
      item.costPerUnit = unitCost;
    }
    await item.save();

    const transaction = await InventoryTransaction.create({
      item: item._id,
      type,
      quantity,
      previousStock,
      newStock,
      unitCost: unitCost || item.costPerUnit,
      totalCost: (unitCost || item.costPerUnit) * Math.abs(quantity),
      reason,
      referenceId,
      recordedBy: req.user?.name || req.user?.email || 'Admin',
    });

    try {
      const io = getIO();
      if (io) {
        io.to('admin').emit('inventory:updated', { item, transaction });
      }
    } catch (e) {
      console.warn('[Socket] inventory:updated event error', e);
    }

    res.status(200).json({
      success: true,
      message: 'স্টক সফলভাবে সমন্বয় করা হয়েছে / Stock adjusted successfully',
      data: {
        item,
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { itemId, limit = 50 } = req.query;
    const query: any = {};
    if (itemId) {
      query.item = itemId;
    }
    const transactions = await InventoryTransaction.find(query)
      .populate('item')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    next(error);
  }
};

export const deleteInventoryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await InventoryItem.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'আইটেম মুছে ফেলা হয়েছে / Item deleted' });
  } catch (error) {
    next(error);
  }
};
