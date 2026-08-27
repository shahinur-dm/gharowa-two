import mongoose, { Document, Schema } from 'mongoose';

export type DiscountType = 'percentage' | 'fixed';

export interface ICoupon extends Document {
  code: string;
  titleBn: string;
  titleEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  discountType: DiscountType;
  discountValue: number; // percentage (e.g. 10) or fixed BDT (e.g. 100)
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: Date;
  expiryDate: Date;
  isActive: boolean;
  usageCount: number;
  maxUsageLimit?: number;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    titleBn: { type: String, required: true, trim: true },
    titleEn: { type: String, required: true, trim: true },
    descriptionBn: { type: String, trim: true },
    descriptionEn: { type: String, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 1 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true, index: true },
    usageCount: { type: Number, default: 0 },
    maxUsageLimit: { type: Number },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
