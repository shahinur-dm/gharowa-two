import mongoose, { Document, Schema } from 'mongoose';

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type SeatingPreference = 'main_hall' | 'family_ac' | 'executive' | 'rooftop_terrace' | 'vip';

export interface IReservation extends Document {
  reservationNumber: string;
  name: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 13:00, 20:30
  guestCount: number;
  seatingPreference: SeatingPreference;
  specialRequests?: string;
  status: ReservationStatus;
  tableNumber?: string;
  adminNotes?: string;
}

const ReservationSchema = new Schema<IReservation>(
  {
    reservationNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    date: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    guestCount: { type: Number, required: true, min: 1, max: 100 },
    seatingPreference: {
      type: String,
      enum: ['main_hall', 'family_ac', 'executive', 'rooftop_terrace', 'vip'],
      default: 'main_hall',
    },
    specialRequests: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    tableNumber: { type: String },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model<IReservation>('Reservation', ReservationSchema);
