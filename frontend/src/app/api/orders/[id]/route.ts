import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getStoreOrderById } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    try {
      const db = await connectToDatabase();
      if (db) {
        let order = null;
        if (mongoose.isValidObjectId(id)) {
          order = await Order.findById(id).lean();
        }
        if (!order) {
          order = await Order.findOne({ orderNumber: id.toUpperCase() }).lean();
        }
        if (order) {
          return NextResponse.json({ success: true, data: order });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB getOrder error:', e.message);
    }

    const fallback = getStoreOrderById(id);
    if (!fallback) {
      return NextResponse.json(
        { success: false, message: 'অর্ডার পাওয়া যায়নি / Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: fallback });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
