import { Request, Response, NextFunction } from 'express';
import { Order, Reservation, InventoryItem, Customer, MenuItem } from '../models';
import { AuthenticatedRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      totalOrdersCount,
      pendingOrdersCount,
      activeKitchenCount,
      todayReservationsCount,
      lowStockItemsCount,
      totalCustomersCount,
      recentOrders,
    ] = await Promise.all([
      // Today orders for revenue
      Order.find({ createdAt: { $gte: today }, orderStatus: { $ne: 'cancelled' } }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: { $in: ['pending', 'cooking', 'ready'] } }),
      Reservation.countDocuments({ date: today.toISOString().split('T')[0] }),
      InventoryItem.countDocuments({ status: { $in: ['low_stock', 'out_of_stock'] } }),
      Customer.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(6),
    ]);

    const todayRevenue = todayOrders.reduce((acc, curr) => acc + curr.grandTotal, 0);

    // Calculate revenue for last 7 days
    const last7Days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      const dayOrders = await Order.find({
        createdAt: { $gte: start, $lte: end },
        orderStatus: { $ne: 'cancelled' },
      });

      const dayRev = dayOrders.reduce((acc, curr) => acc + curr.grandTotal, 0);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      last7Days.push({
        date: start.toISOString().split('T')[0],
        day: dayName,
        revenue: dayRev,
        orders: dayOrders.length,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        todayRevenue,
        todayOrdersCount: todayOrders.length,
        totalOrdersCount,
        pendingOrdersCount,
        activeKitchenCount,
        todayReservationsCount,
        lowStockItemsCount,
        totalCustomersCount,
        revenueTrend: last7Days,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$grandTotal' }, count: { $sum: 1 } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const totalCount = totalRevenueAgg[0]?.count || 0;
    const averageOrderValue = totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0;

    // Payment Methods Breakdown
    const paymentBreakdown = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$grandTotal' } } },
    ]);

    // Order Source Breakdown
    const sourceBreakdown = await Order.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    // Top Selling Items
    const topItems = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.nameBn',
          nameEn: { $first: '$items.nameEn' },
          totalQuantity: { $sum: '$items.quantity' },
          totalSales: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: totalCount,
        averageOrderValue,
        paymentBreakdown,
        sourceBreakdown,
        topItems,
      },
    });
  } catch (error) {
    next(error);
  }
};
