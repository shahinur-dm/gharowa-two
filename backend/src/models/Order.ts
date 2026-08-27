import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'delivered' | 'cancelled';
export type OrderSource = 'website' | 'website_whatsapp' | 'phone' | 'counter';
export type PaymentMethod = 'cash_on_delivery' | 'bkash' | 'nagad' | 'pos_card' | 'counter_cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  nameBn: string;
  nameEn: string;
  price: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface IStatusHistory {
  status: OrderStatus;
  changedAt: Date;
  changedBy?: string;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string; // e.g. GH-1042
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    area?: string;
  };
  customerRef?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  source: OrderSource;
  statusHistory: IStatusHistory[];
  specialInstructions?: string;
  whatsappMessage?: string;
  estimatedDeliveryMinutes?: number;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    nameBn: { type: String, required: true },
    nameEn: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
    notes: { type: String },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: {
      type: String,
      enum: ['pending', 'cooking', 'ready', 'delivered', 'cancelled'],
      required: true,
    },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String },
    note: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, index: true },
      email: { type: String, trim: true },
      address: { type: String, required: true, trim: true },
      area: { type: String, trim: true },
    },
    customerRef: { type: Schema.Types.ObjectId, ref: 'Customer' },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 60 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, uppercase: true, trim: true },
    grandTotal: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'bkash', 'nagad', 'pos_card', 'counter_cash'],
      default: 'cash_on_delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'cooking', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    source: {
      type: String,
      enum: ['website', 'website_whatsapp', 'phone', 'counter'],
      default: 'website_whatsapp',
      index: true,
    },
    statusHistory: [StatusHistorySchema],
    specialInstructions: { type: String },
    whatsappMessage: { type: String },
    estimatedDeliveryMinutes: { type: Number, default: 45 },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
