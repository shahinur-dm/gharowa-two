import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReservation extends Document {
  name: string;
  phone: string;
  email?: string;
  guests: number;
  date: string;
  time: string;
  tableType?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    guests: { type: Number, required: true, default: 2, min: 1 },
    date: { type: String, required: true },
    time: { type: String, required: true },
    tableType: { type: String, default: 'General', trim: true },
    specialRequests: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export const Reservation: Model<IReservation> =
  mongoose.models.Reservation ||
  mongoose.model<IReservation>('Reservation', ReservationSchema);
