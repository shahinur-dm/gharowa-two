import { NextResponse } from 'next/server';
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
        const updated = await CustomerReview.findByIdAndUpdate(id, body, { new: true }).lean();
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
      console.warn('MongoDB review update fallback:', e.message);
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
        await CustomerReview.findByIdAndDelete(id);
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
