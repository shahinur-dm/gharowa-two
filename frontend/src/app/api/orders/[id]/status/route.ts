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

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let order = null;
    if (mongoose.isValidObjectId(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'অর্ডার পাওয়া যায়নি' },
        { status: 404 }
      );
    }

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
    const savedOrder = order.toObject ? order.toObject() : order;

    updateStoreOrderStatus(id, status, note);

    return NextResponse.json({
      success: true,
      message: `অর্ডার স্ট্যাটাস আপডেট হয়েছে (${status})`,
      data: savedOrder,
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
