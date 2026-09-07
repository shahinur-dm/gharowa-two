import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { CustomerReview } from '@/models/CustomerReview';
import { updateStoreCustomerReview, deleteStoreCustomerReview } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    try {
      const db = await connectToDatabase();
      if (db) {
        let updated = null;
        if (mongoose.isValidObjectId(id)) {
          updated = await CustomerReview.findByIdAndUpdate(id, body, { new: true }).lean();
        }
        if (!updated) {
          updated = await CustomerReview.findOneAndUpdate({ _id: id }, body, { new: true }).lean();
        }
        if (updated) {
          updateStoreCustomerReview(id, body);
          return NextResponse.json({
            success: true,
            message: 'রিভিউ আপডেট সফল হয়েছে',
            data: updated,
          });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB review update notice:', e.message);
    }

    const fallbackUpdated = updateStoreCustomerReview(id, body);
    return NextResponse.json({
      success: true,
      message: 'রিভিউ আপডেট সফল হয়েছে',
      data: fallbackUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    try {
      const db = await connectToDatabase();
      if (db) {
        if (mongoose.isValidObjectId(id)) {
          await CustomerReview.findByIdAndDelete(id);
        } else {
          await CustomerReview.findOneAndDelete({ _id: id });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB review delete notice:', e.message);
    }

    deleteStoreCustomerReview(id);

    return NextResponse.json({
      success: true,
      message: 'রিভিউ সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
