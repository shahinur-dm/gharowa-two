import { Request, Response, NextFunction } from 'express';
import { Reservation } from '../models';
import { generateReservationNumber } from '../utils/banglaHelper';
import { AuthenticatedRequest } from '../middleware/auth';
import { getIO } from '../sockets';

export const createReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reservationNumber = generateReservationNumber();
    const reservation = await Reservation.create({
      reservationNumber,
      ...req.body,
      status: 'pending',
    });

    try {
      const io = getIO();
      if (io) {
        io.to('admin').emit('reservation:created', reservation);
      }
    } catch (e) {
      console.warn('[Socket] reservation:created event error', e);
    }

    res.status(201).json({
      success: true,
      message: 'টেবিল বুকিং এর অনুরোধ গৃহীত হয়েছে! আমরা দ্রুত কনফার্ম করব। / Reservation request received successfully!',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, date, search, limit = 50, page = 1 } = req.query;

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (date) {
      query.date = date;
    }
    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [{ name: regex }, { phone: regex }, { reservationNumber: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Reservation.countDocuments(query);
    const reservations = await Reservation.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, tableNumber, adminNotes } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status, tableNumber, adminNotes },
      { new: true }
    );

    if (!reservation) {
      res.status(404).json({ success: false, message: 'বুকিং পাওয়া যায়নি / Reservation not found' });
      return;
    }

    try {
      const io = getIO();
      if (io) {
        io.to('admin').emit('reservation:updated', reservation);
      }
    } catch (e) {
      console.warn('[Socket] reservation:updated event error', e);
    }

    res.status(200).json({
      success: true,
      message: 'বুকিং স্ট্যাটাস আপডেট হয়েছে / Reservation updated',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReservation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await Reservation.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'বুকিং মুছে ফেলা হয়েছে / Reservation deleted' });
  } catch (error) {
    next(error);
  }
};
