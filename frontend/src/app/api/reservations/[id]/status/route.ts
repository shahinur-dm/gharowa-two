import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Reservation } from '@/models/Reservation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let updated = null;
    if (mongoose.isValidObjectId(id)) {
      updated = await Reservation.findByIdAndUpdate(
        id,
        { status: body.status },
        { new: true }
      ).lean();
    }
    if (!updated) {
      updated = await Reservation.findOneAndUpdate(
        { _id: id },
        { status: body.status },
        { new: true }
      ).lean();
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Reservation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation status updated successfully',
      data: updated,
    });
  } catch (err: any) {
    console.error('Error updating reservation status:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update reservation status: ' + err.message },
      { status: 500 }
    );
  }
}
