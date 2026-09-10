import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInventoryItem extends Document {
  nameBn: string;
  nameEn: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  costPerUnit: number;
  lastRestocked: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    currentStock: { type: Number, required: true, default: 0, min: 0 },
    minThreshold: { type: Number, required: true, default: 10, min: 0 },
    unit: { type: String, default: 'কেজি (kg)', trim: true },
    costPerUnit: { type: Number, default: 0, min: 0 },
    lastRestocked: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

export const InventoryItem: Model<IInventoryItem> =
  mongoose.models.InventoryItem ||
  mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
