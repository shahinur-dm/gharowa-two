import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaAsset extends Document {
  title: string;
  category: 'food' | 'hero' | 'chef_owner' | 'about' | 'logo' | 'brand' | 'general';
  url: string;
  size?: string;
  addedDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['food', 'hero', 'chef_owner', 'about', 'logo', 'brand', 'general'],
      default: 'general',
    },
    url: { type: String, required: true, trim: true },
    size: { type: String, default: 'Asset' },
    addedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  {
    timestamps: true,
  }
);

export const MediaAsset =
  mongoose.models.MediaAsset || mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);
