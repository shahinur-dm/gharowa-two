import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomerReview extends Document {
  customerName: string;
  avatarUrl?: string;
  rating: number;
  reviewText: string;
  reviewDateText?: string;
  platform?: string;
  isVerified?: boolean;
  displayOrder: number;
  isActive: boolean;
}

const CustomerReviewSchema = new Schema<ICustomerReview>(
  {
    customerName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: '', trim: true },
    rating: { type: Number, required: true, default: 5, min: 1, max: 5 },
    reviewText: { type: String, required: true, trim: true },
    reviewDateText: { type: String, default: '1 year ago' },
    platform: { type: String, default: 'google' },
    isVerified: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const CustomerReview =
  mongoose.models.CustomerReview ||
  mongoose.model<ICustomerReview>('CustomerReview', CustomerReviewSchema);
