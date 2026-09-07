'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  ChefHat,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Clock,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { formatPrice } from '../../../lib/bangla';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res: any = await api.get('/dashboard/stats');
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (e) {
        console.warn('Dashboard fetch error', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Today's Revenue",
      titleBn: 'আজকের মোট বিক্রয়',
      value: stats ? formatPrice(stats.todayRevenue, 'en') : '৳0',
      icon: DollarSign,
      iconBg: 'bg-amber-100 text-amber-800',
      sub: `${stats?.todayOrdersCount || 0} orders today`,
    },
    {
      title: 'Active Kitchen Tickets',
      titleBn: 'কিচেনে চলমান অর্ডার',
      value: stats?.activeKitchenCount || '0',
      icon: ChefHat,
      iconBg: 'bg-emerald-100 text-emerald-800',
      sub: `${stats?.pendingOrdersCount || 0} pending acceptance`,
      link: '/admin/kitchen',
    },
    {
      title: 'Total All Orders',
      titleBn: 'সর্বমোট অর্ডার সংখ্যা',
      value: stats?.totalOrdersCount || '0',
      icon: ShoppingBag,
      iconBg: 'bg-blue-100 text-blue-800',
      sub: 'Lifetime order count',
      link: '/admin/orders',
    },
    {
      title: 'Low Stock Alerts',
      titleBn: 'স্টক অ্যালার্ট আইটেম',
      value: stats?.lowStockItemsCount || '0',
      icon: AlertTriangle,
      iconBg: stats?.lowStockItemsCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700',
      sub: 'Raw materials need restocking',
      link: '/admin/inventory',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#900C19] font-semibold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gharowa Live POS & ERP System</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            ঘরোয়া রেস্টুরেন্ট ম্যানেজমেন্ট ড্যাশবোর্ড
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            রিয়েল-টাইম অর্ডার ট্র্যাকিং, লাইভ কিচেন এবং ইনভেন্টরি পর্যবেক্ষণ।
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/kitchen"
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen KDS খুলুন</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডার তালিকা</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-600 font-medium">{card.title}</span>
                <div className={`p-2 rounded-xl ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-900 font-mono tracking-tight">{card.value}</h3>
                <p className="text-[11px] text-slate-500 mt-1 font-bengali font-normal">{card.titleBn}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-normal">{card.sub}</p>
              </div>

              {card.link && (
                <Link
                  href={card.link}
                  className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-[#900C19] hover:text-[#780a15] flex items-center justify-between font-medium"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* 7 Days Revenue Trend & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#900C19]" />
              <span>Last 7 Days Sales Trend (গত ৭ দিনের বিক্রয়)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Revenue (BDT)</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.revenueTrend && stats.revenueTrend.length > 0 ? (
              stats.revenueTrend.map((day: any, idx: number) => {
                const maxRev = Math.max(...stats.revenueTrend.map((d: any) => d.revenue), 1000);
                const percent = Math.min(100, Math.round((day.revenue / maxRev) * 100));

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-mono font-medium">
                        {day.day} ({day.date})
                      </span>
                      <span className="font-semibold text-slate-900 font-mono">
                        ৳{day.revenue.toLocaleString()} <span className="text-slate-500 font-normal">({day.orders} orders)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#900C19] to-red-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 font-normal">
                কোনো বিক্রয় রেকর্ড পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#900C19]" />
              <span>Recent Orders (সাম্প্রতিক অর্ডার)</span>
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-[#900C19] hover:underline font-medium"
            >
              সব দেখুন →
            </Link>
          </div>

          <div className="space-y-2.5 pt-1">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order: any) => (
                <div
                  key={order._id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-mono font-semibold text-[#900C19] block">
                      {order.orderNumber}
                    </span>
                    <span className="text-slate-700 font-bengali font-normal block truncate mt-0.5">
                      {order.customer.name} • {order.customer.phone}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-semibold text-slate-900 block font-mono">
                      ৳{order.grandTotal.toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase inline-block mt-0.5 ${
                        order.orderStatus === 'ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'cooking'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 font-normal">
                কোনো সাম্প্রতিক অর্ডার নেই
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
