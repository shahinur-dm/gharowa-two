import { Request, Response, NextFunction } from 'express';
import { Order, MenuItem, Customer, Coupon, RestaurantSettings } from '../models';
import { generateOrderNumber, formatBDT } from '../utils/banglaHelper';
import { generateWhatsAppOrderMessage, createWhatsAppDeepLink } from '../utils/whatsappGenerator';
import { AuthenticatedRequest } from '../middleware/auth';
import { getIO } from '../sockets';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customer, items, couponCode, paymentMethod, source, specialInstructions } = req.body;

    // 1. Fetch current settings for delivery fee & whatsapp number
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create({});
    }

    if (!settings.isOnlineOrderActive) {
      res.status(400).json({
        success: false,
        message: 'বর্তমানে অনলাইন অর্ডার সাময়িকভাবে বন্ধ আছে / Online ordering is temporarily paused',
      });
      return;
    }

    // 2. Fetch and verify prices from MongoDB for every item
    const itemIds = items.map((i: any) => i.menuItemId);
    const dbMenuItems = await MenuItem.find({ _id: { $in: itemIds } });

    if (dbMenuItems.length !== items.length) {
      res.status(400).json({
        success: false,
        message: 'কিছু খাবারের আইটেম পাওয়া যায়নি / One or more items not found in menu',
      });
      return;
    }

    let subtotal = 0;
    const verifiedOrderItems = items.map((orderItem: any) => {
      const dbItem = dbMenuItems.find((m) => m._id.toString() === orderItem.menuItemId);
      if (!dbItem) {
        throw new Error(`Item ${orderItem.menuItemId} not found`);
      }
      if (!dbItem.isAvailable) {
        throw new Error(`${dbItem.nameBn} বর্তমানে উপলব্ধ নেই / ${dbItem.nameEn} is currently out of stock`);
      }

      const itemSubtotal = dbItem.price * orderItem.quantity;
      subtotal += itemSubtotal;

      return {
        menuItem: dbItem._id,
        nameBn: dbItem.nameBn,
        nameEn: dbItem.nameEn,
        price: dbItem.price,
        quantity: orderItem.quantity,
        subtotal: itemSubtotal,
        notes: orderItem.notes,
      };
    });

    if (subtotal < settings.minOrderAmount) {
      res.status(400).json({
        success: false,
        message: `ন্যূনতম অর্ডারের পরিমাণ ৳${settings.minOrderAmount} / Minimum order amount is ৳${settings.minOrderAmount}`,
      });
      return;
    }

    // 3. Delivery fee logic
    let deliveryCharge = settings.standardDeliveryFee;
    if (settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold) {
      deliveryCharge = 0;
    }

    // 4. Validate Coupon (if provided)
    let discount = 0;
    let validCouponCode = '';
    if (couponCode && couponCode.trim()) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() },
      });

      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
            discount = coupon.maxDiscountAmount;
          }
        } else {
          discount = coupon.discountValue;
        }
        validCouponCode = coupon.code;
        // Increment coupon usage
        coupon.usageCount += 1;
        await coupon.save();
      }
    }

    const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);
    const orderNumber = generateOrderNumber();

    // 5. Customer upsert
    let customerDoc = await Customer.findOne({ phone: customer.phone });
    if (!customerDoc) {
      customerDoc = await Customer.create({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        area: customer.area,
        totalOrders: 1,
        totalSpent: grandTotal,
        lastOrderDate: new Date(),
      });
    } else {
      customerDoc.name = customer.name;
      customerDoc.address = customer.address;
      customerDoc.totalOrders += 1;
      customerDoc.totalSpent += grandTotal;
      customerDoc.lastOrderDate = new Date();
      await customerDoc.save();
    }

    // 6. Generate WhatsApp Order Message
    const whatsappPayload = {
      orderNumber,
      items: verifiedOrderItems,
      subtotal,
      deliveryCharge,
      discount,
      grandTotal,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      },
      paymentMethod: paymentMethod || 'cash_on_delivery',
      specialInstructions,
    };

    const whatsappMessage = generateWhatsAppOrderMessage(whatsappPayload);
    const whatsappDeepLink = createWhatsAppDeepLink(settings.whatsappNumber, whatsappMessage);

    // 7. Save Order to MongoDB
    const order = await Order.create({
      orderNumber,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        area: customer.area,
      },
      customerRef: customerDoc._id,
      items: verifiedOrderItems,
      subtotal,
      deliveryCharge,
      discount,
      couponCode: validCouponCode || undefined,
      grandTotal,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      source: source || 'website_whatsapp',
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date(),
          note: 'অর্ডার গ্রহণ করা হয়েছে / Order received',
        },
      ],
      specialInstructions,
      whatsappMessage,
      estimatedDeliveryMinutes: 45,
    });

    // 8. Realtime Broadcast through Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.to('admin').emit('order:created', order);
        io.to('kitchen').emit('order:created', order);
      }
    } catch (e) {
      console.warn('[Socket] Could not emit order:created event', e);
    }

    res.status(201).json({
      success: true,
      message: 'অর্ডার সফলভাবে তৈরি হয়েছে / Order placed successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        grandTotal: order.grandTotal,
        whatsappMessage,
        whatsappDeepLink,
        order,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'অর্ডার করতে সমস্যা হয়েছে / Failed to place order',
    });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, paymentStatus, search, limit = 50, page = 1 } = req.query;

    const query: any = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    if (source && source !== 'all') {
      query.source = source;
    }
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }
    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [
        { orderNumber: regex },
        { 'customer.name': regex },
        { 'customer.phone': regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getKitchenOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find({
      orderStatus: { $in: ['pending', 'cooking', 'ready'] },
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.menuItem');
    if (!order) {
      res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি / Order not found' });
      return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrderByNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber: orderNumber.toUpperCase() });
    if (!order) {
      res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি / Order not found' });
      return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি / Order not found' });
      return;
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user?.name || req.user?.email || 'Staff',
      note: note || `স্ট্যাটাস পরিবর্তন: ${status}`,
    });

    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    // Broadcast Realtime Update
    try {
      const io = getIO();
      if (io) {
        io.to('admin').emit('order:statusChanged', { orderId: order._id, orderNumber: order.orderNumber, status, order });
        io.to('kitchen').emit('order:statusChanged', { orderId: order._id, orderNumber: order.orderNumber, status, order });
        io.to(`order:${order._id}`).emit('order:updated', order);
      }
    } catch (e) {
      console.warn('[Socket] Could not emit order status update', e);
    }

    res.status(200).json({
      success: true,
      message: `অর্ডার স্ট্যাটাস আপডেট হয়েছে (${status}) / Order status updated`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
