import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Reservation } from '@/models/Reservation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    let deleted = null;
    if (mongoose.isValidObjectId(id)) {
      deleted = await Reservation.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Reservation.findOneAndDelete({ _id: id });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Reservation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation deleted successfully',
      data: { id },
    });
  } catch (err: any) {
    console.error('Error deleting reservation:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete reservation: ' + err.message },
      { status: 500 }
    );
  }
}
