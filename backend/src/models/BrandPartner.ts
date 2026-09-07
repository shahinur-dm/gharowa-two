import mongoose, { Document, Schema } from 'mongoose';

export interface IBrandPartner extends Document {
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

const BrandPartnerSchema = new Schema<IBrandPartner>(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, required: true, trim: true },
    websiteUrl: { type: String, default: '', trim: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const BrandPartner =
  mongoose.models.BrandPartner ||
  mongoose.model<IBrandPartner>('BrandPartner', BrandPartnerSchema);
