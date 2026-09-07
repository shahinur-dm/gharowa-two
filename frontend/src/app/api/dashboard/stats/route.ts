import { NextResponse } from 'next/server';
import { getStoreMenuItems, getStoreCategories } from '@/lib/serverStore';

export async function GET() {
  try {
    const items = getStoreMenuItems();
    const categories = getStoreCategories();

    return NextResponse.json({
      success: true,
      data: {
        todayRevenue: 48500,
        todayOrdersCount: 42,
        activeKitchenCount: 3,
        pendingOrdersCount: 2,
        totalOrdersCount: 1250,
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
        recentOrders: [
          {
            _id: 'ord-101',
            orderNumber: 'GH-8901',
            customer: { name: 'Shahinur Rahman', phone: '01711223344' },
            grandTotal: 1140,
            orderStatus: 'cooking',
          },
          {
            _id: 'ord-102',
            orderNumber: 'GH-8902',
            customer: { name: 'Mohammad Faruk', phone: '01819334455' },
            grandTotal: 580,
            orderStatus: 'ready',
          },
          {
            _id: 'ord-103',
            orderNumber: 'GH-8903',
            customer: { name: 'Tarek Hasan', phone: '01973255888' },
            grandTotal: 840,
            orderStatus: 'delivered',
          },
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
