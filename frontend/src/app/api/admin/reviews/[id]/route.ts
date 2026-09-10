import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { CustomerReview } from '@/models/CustomerReview';
import { updateStoreCustomerReview, deleteStoreCustomerReview } from '@/lib/serverStore';
import { invalidateReviewsCache } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    await connectToDatabase();

    let updated = null;
    if (mongoose.isValidObjectId(id)) {
      updated = await CustomerReview.findByIdAndUpdate(id, body, { new: true }).lean();
    }
    if (!updated) {
      updated = await CustomerReview.findOneAndUpdate({ _id: id }, body, { new: true }).lean();
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Review not found in database' },
        { status: 404 }
      );
    }

    invalidateReviewsCache();
    updateStoreCustomerReview(id, body);

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'রিভিউ আপডেট সফল হয়েছে',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update review' },
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

    await connectToDatabase();

    let deleted = null;
    if (mongoose.isValidObjectId(id)) {
      deleted = await CustomerReview.findByIdAndDelete(id);
    } else {
      deleted = await CustomerReview.findOneAndDelete({ _id: id });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Review not found in database' },
        { status: 404 }
      );
    }

    invalidateReviewsCache();
    deleteStoreCustomerReview(id);

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'রিভিউ সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
