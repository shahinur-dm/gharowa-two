import { Request, Response, NextFunction } from 'express';
import { Customer, Order } from '../models';
import { AuthenticatedRequest } from '../middleware/auth';

export const getCustomers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, limit = 50, page = 1 } = req.query;

    const query: any = {};
    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [{ name: regex }, { phone: regex }, { address: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ totalSpent: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, data: customers });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const orders = await Order.find({ 'customer.phone': customer.phone }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        customer,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Customer updated', data: customer });
  } catch (error) {
    next(error);
  }
};
