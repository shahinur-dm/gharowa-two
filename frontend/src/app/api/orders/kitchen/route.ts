import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getStoreOrders } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const orders = getStoreOrders();
    const activeKitchenOrders = orders.filter((o) =>
      ['pending', 'cooking', 'ready'].includes(o.orderStatus)
    );

    return NextResponse.json(
      { success: true, count: activeKitchenOrders.length, data: activeKitchenOrders },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch kitchen orders' },
      { status: 500 }
    );
  }
}
