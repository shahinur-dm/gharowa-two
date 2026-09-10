import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectToDatabase();

    let order = null;
    if (mongoose.isValidObjectId(id)) {
      order = await Order.findById(id).lean();
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() }).lean();
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'অর্ডার পাওয়া যায়নি / Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Failed to fetch order details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order details: ' + error.message },
      { status: 500 }
    );
  }
}
