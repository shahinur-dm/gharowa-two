import { NextResponse } from 'next/server';
import { getStoreOrders } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const orders = getStoreOrders();

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    const paymentBreakdown = {
      cash_on_delivery: orders.filter((o) => o.paymentMethod === 'cash_on_delivery').length,
      bkash: orders.filter((o) => o.paymentMethod === 'bkash').length,
      nagad: orders.filter((o) => o.paymentMethod === 'nagad').length,
    };

    const statusBreakdown = {
      pending: orders.filter((o) => o.orderStatus === 'pending').length,
      cooking: orders.filter((o) => o.orderStatus === 'cooking').length,
      ready: orders.filter((o) => o.orderStatus === 'ready').length,
      delivered: orders.filter((o) => o.orderStatus === 'delivered').length,
      cancelled: orders.filter((o) => o.orderStatus === 'cancelled').length,
    };

    const topSellingDishes = [
      { name: 'Mutton Bhuna Khichuri', count: 184, revenue: 62560 },
      { name: 'Special Mutton Kacchi', count: 142, revenue: 53960 },
      { name: 'Mutton Leg Khichuri', count: 98, revenue: 47040 },
      { name: 'Chicken Biryani & Borhani', count: 86, revenue: 21500 },
    ];

    return NextResponse.json(
      {
        success: true,
        data: {
          totalSales,
          totalOrders,
          averageOrderValue,
          paymentBreakdown,
          statusBreakdown,
          topSellingDishes,
          monthlyRevenue: [
            { month: 'Apr', revenue: 145000 },
            { month: 'May', revenue: 182000 },
            { month: 'Jun', revenue: 198000 },
            { month: 'Jul', revenue: 210000 },
            { month: 'Aug', revenue: 245000 },
            { month: 'Sep', revenue: totalSales + 85000 },
          ],
        },
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports data' },
      { status: 500 }
    );
  }
}
