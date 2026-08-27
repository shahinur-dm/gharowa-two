'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  ChefHat,
  Calendar,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Clock,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { formatPrice, toBanglaNumber } from '../../../lib/bangla';

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
      color: 'from-amber-500 to-gold-500',
      sub: `${stats?.todayOrdersCount || 0} orders today`,
    },
    {
      title: 'Active Kitchen Tickets',
      titleBn: 'কিচেনে চলমান অর্ডার',
      value: stats?.activeKitchenCount || '0',
      icon: ChefHat,
      color: 'from-emerald-500 to-teal-600',
      sub: `${stats?.pendingOrdersCount || 0} pending acceptance`,
      link: '/admin/kitchen',
    },
    {
      title: 'Total All Orders',
      titleBn: 'সর্বমোট অর্ডার সংখ্যা',
      value: stats?.totalOrdersCount || '0',
      icon: ShoppingBag,
      color: 'from-blue-500 to-indigo-600',
      sub: 'Lifetime order count',
      link: '/admin/orders',
    },
    {
      title: 'Low Stock Alerts',
      titleBn: 'স্টক অ্যালার্ট আইটেম',
      value: stats?.lowStockItemsCount || '0',
      icon: AlertTriangle,
      color: stats?.lowStockItemsCount > 0 ? 'from-rose-500 to-red-600' : 'from-gray-600 to-gray-700',
      sub: 'Raw materials need restocking',
      link: '/admin/inventory',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-obsidian-400 via-obsidian-400 to-obsidian-300 border border-gold-500/25 shadow-gold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-semibold bg-gold-500/10 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gharowa Live POS & ERP System</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-bengali">
            ঘরোয়া রেস্টুরেন্ট ম্যানেজমেন্ট ড্যাশবোর্ড
          </h1>
          <p className="text-xs text-gray-400">
            রিয়েল-টাইম অর্ডার ট্র্যাকিং, লাইভ কিচেন এবং ইনভেন্টরি পর্যবেক্ষণ।
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/kitchen"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen KDS খুলুন</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-gold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডার তালিকা</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-obsidian-400 border border-gold-500/15 hover:border-gold-500/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium">{card.title}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white font-mono">{card.value}</h3>
                <p className="text-[11px] text-gray-400 mt-1 font-bengali">{card.titleBn}</p>
                <p className="text-[10px] text-gold-400/80 mt-0.5">{card.sub}</p>
              </div>

              {card.link && (
                <Link
                  href={card.link}
                  className="pt-3 mt-3 border-t border-white/5 text-[11px] text-gold-400 hover:text-gold-300 flex items-center justify-between font-semibold"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* 7 Days Revenue Trend & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Table / Visual */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-obsidian-400 border border-gold-500/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold-400" />
              <span>Last 7 Days Sales Trend (গত ৭ দিনের বিক্রয়)</span>
            </h3>
            <span className="text-[11px] text-gray-400 font-mono">Revenue (BDT)</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {stats?.revenueTrend && stats.revenueTrend.length > 0 ? (
              stats.revenueTrend.map((day: any, idx: number) => {
                const maxRev = Math.max(...stats.revenueTrend.map((d: any) => d.revenue), 1000);
                const percent = Math.min(100, Math.round((day.revenue / maxRev) * 100));

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300 font-mono">
                        {day.day} ({day.date})
                      </span>
                      <span className="font-bold text-gold-400 font-mono">
                        ৳{day.revenue.toLocaleString()} ({day.orders} orders)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-obsidian-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-gold-400 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-gray-400">
                কোনো বিক্রয় রেকর্ড পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-obsidian-400 border border-gold-500/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>Recent Orders (সাম্প্রতিক অর্ডার)</span>
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold"
            >
              সব দেখুন →
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order: any) => (
                <div
                  key={order._id}
                  className="p-3 rounded-2xl bg-obsidian-300/80 border border-gold-500/10 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-gold-400 block">
                      {order.orderNumber}
                    </span>
                    <span className="text-gray-300 font-bengali block mt-0.5">
                      {order.customer.name} ({order.customer.phone})
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-white block">
                      ৳{order.grandTotal.toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        order.orderStatus === 'ready'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : order.orderStatus === 'cooking'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400">
                কোনো সাম্প্রতিক অর্ডার নেই
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
