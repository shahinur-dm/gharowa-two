import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'purchase' | 'adjustment' | 'waste' | 'order_consumption' | 'return';

export interface IInventoryTransaction extends Document {
  item: mongoose.Types.ObjectId;
  type: TransactionType;
  quantity: number; // positive or negative
  previousStock: number;
  newStock: number;
  unitCost?: number;
  totalCost?: number;
  reason?: string;
  referenceId?: string; // Order ID or Invoice ID
  recordedBy?: string;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true, index: true },
    type: {
      type: String,
      enum: ['purchase', 'adjustment', 'waste', 'order_consumption', 'return'],
      required: true,
      index: true,
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    unitCost: { type: Number },
    totalCost: { type: Number },
    reason: { type: String, trim: true },
    referenceId: { type: String, trim: true },
    recordedBy: { type: String },
  },
  { timestamps: true }
);

export const InventoryTransaction = mongoose.model<IInventoryTransaction>(
  'InventoryTransaction',
  InventoryTransactionSchema
);
