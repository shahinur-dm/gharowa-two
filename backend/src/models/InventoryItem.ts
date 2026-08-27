import mongoose, { Document, Schema } from 'mongoose';

export type InventoryUnit = 'kg' | 'liter' | 'piece' | 'packet' | 'gram';
export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type InventoryCategory = 'meat_poultry' | 'fish' | 'rice_grains' | 'spices_oil' | 'dairy_beverage' | 'packaging' | 'produce';

export interface IInventoryItem extends Document {
  nameBn: string;
  nameEn: string;
  category: InventoryCategory;
  unit: InventoryUnit;
  currentStock: number;
  minStockThreshold: number;
  costPerUnit: number;
  supplier?: string;
  status: InventoryStatus;
  lastRestockedDate?: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['meat_poultry', 'fish', 'rice_grains', 'spices_oil', 'dairy_beverage', 'packaging', 'produce'],
      required: true,
      index: true,
    },
    unit: {
      type: String,
      enum: ['kg', 'liter', 'piece', 'packet', 'gram'],
      required: true,
    },
    currentStock: { type: Number, required: true, min: 0 },
    minStockThreshold: { type: Number, required: true, min: 0 },
    costPerUnit: { type: Number, required: true, min: 0 },
    supplier: { type: String, trim: true },
    status: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
      index: true,
    },
    lastRestockedDate: { type: Date },
  },
  { timestamps: true }
);

InventoryItemSchema.pre('save', function (next) {
  if (this.currentStock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.currentStock <= this.minStockThreshold) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  next();
});

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
