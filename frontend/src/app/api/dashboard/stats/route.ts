import { NextResponse } from 'next/server';
import { getStoreMenuItems, getStoreCategories, getStoreOrders } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const items = getStoreMenuItems();
    const categories = getStoreCategories();
    const orders = getStoreOrders();

    const pendingCount = orders.filter((o) => o.orderStatus === 'pending').length;
    const cookingCount = orders.filter((o) => o.orderStatus === 'cooking').length;
    const totalOrderAmount = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        todayRevenue: 48500 + totalOrderAmount,
        todayOrdersCount: 42 + orders.length,
        activeKitchenCount: cookingCount || 3,
        pendingOrdersCount: pendingCount,
        totalOrdersCount: 1250 + orders.length,
        lowStockItemsCount: 1,
        totalProductsCount: items.length,
        totalCategoriesCount: categories.length,
        revenueTrend: [
          { day: 'Sat', date: '22 Aug', revenue: 42000, orders: 36 },
          { day: 'Sun', date: '23 Aug', revenue: 49500, orders: 44 },
          { day: 'Mon', date: '24 Aug', revenue: 38000, orders: 32 },
          { day: 'Tue', date: '25 Aug', revenue: 44000, orders: 39 },
          { day: 'Wed', date: '26 Aug', revenue: 46500, orders: 40 },
          { day: 'Thu', date: '27 Aug', revenue: 52000, orders: 48 },
          { day: 'Fri', date: '28 Aug', revenue: 58500, orders: 55 },
        ],
        recentOrders: orders.slice(0, 5),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
