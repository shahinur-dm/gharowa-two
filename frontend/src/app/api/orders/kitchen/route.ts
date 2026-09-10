import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();

    const activeKitchenOrders = await Order.find({
      orderStatus: { $in: ['pending', 'cooking', 'ready'] }
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, count: activeKitchenOrders.length, data: activeKitchenOrders },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (err: any) {
    console.error('Failed to fetch kitchen orders from database:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch kitchen orders: ' + err.message },
      { status: 500 }
    );
  }
}
