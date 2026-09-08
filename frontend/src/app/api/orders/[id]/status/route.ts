import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { updateStoreOrderStatus } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, note } = body;

    try {
      const db = await connectToDatabase();
      if (db) {
        let order = null;
        if (mongoose.isValidObjectId(id)) {
          order = await Order.findById(id);
        }
        if (!order) {
          order = await Order.findOne({ orderNumber: id.toUpperCase() });
        }
        if (order) {
          order.orderStatus = status;
          if (status === 'delivered') {
            order.paymentStatus = 'paid';
          }
          order.statusHistory.push({
            status,
            changedAt: new Date(),
            changedBy: 'Admin POS',
            note: note || `স্ট্যাটাস আপডেট: ${status}`,
          });
          await order.save();
          updateStoreOrderStatus(id, status, note);

          return NextResponse.json({
            success: true,
            message: `অর্ডার স্ট্যাটাস আপডেট হয়েছে (${status})`,
            data: order,
          });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB order status update error:', e.message);
    }

    const fallback = updateStoreOrderStatus(id, status, note);
    if (!fallback) {
      return NextResponse.json(
        { success: false, message: 'অর্ডার পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `অর্ডার স্ট্যাটাস আপডেট হয়েছে (${status})`,
      data: fallback,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
