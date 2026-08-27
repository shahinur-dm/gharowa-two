import { Request, Response, NextFunction } from 'express';
import { Coupon } from '../models';
import { AuthenticatedRequest } from '../middleware/auth';

export const getPublicCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gte: new Date() },
    }).select('-usageCount');
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

export const getAllCouponsAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'কুপন কোড দিন / Please enter a coupon code' });
      return;
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

    if (!coupon) {
      res.status(404).json({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ কুপন কোড / Invalid or expired coupon code' });
      return;
    }

    if (coupon.maxUsageLimit && coupon.usageCount >= coupon.maxUsageLimit) {
      res.status(400).json({ success: false, message: 'এই কুপনের ব্যবহারের সীমা শেষ হয়ে গেছে / Coupon usage limit exceeded' });
      return;
    }

    const orderAmount = Number(subtotal) || 0;
    if (orderAmount < coupon.minOrderAmount) {
      res.status(400).json({
        success: false,
        message: `এই কুপনের জন্য ন্যূনতম অর্ডার ৳${coupon.minOrderAmount} হতে হবে / Minimum order ৳${coupon.minOrderAmount} required`,
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      message: 'কুপন সফলভাবে প্রয়োগ করা হয়েছে! / Coupon applied successfully!',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
        titleBn: coupon.titleBn,
        titleEn: coupon.titleEn,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase().trim(),
    });
    res.status(201).json({ success: true, message: 'কুপন তৈরি হয়েছে / Coupon created', data: coupon });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'কুপন আপডেট হয়েছে / Coupon updated', data: coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'কুপন মুছে ফেলা হয়েছে / Coupon deleted' });
  } catch (error) {
    next(error);
  }
};
