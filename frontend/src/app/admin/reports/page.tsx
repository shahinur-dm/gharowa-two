'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, Utensils, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/dashboard/reports');
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch (e) {
      console.warn('Reports fetch error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            <span>Sales & Financial Analytics (বিক্রয় ও আর্থিক প্রতিবেদন)</span>
          </h1>
          <p className="text-xs text-gray-400">
            সর্বমোট আয়, গড়ে প্রতিটি অর্ডারের মূল্য এবং জনপ্রিয় খাবারের বিশ্লেষণ
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="p-2.5 rounded-xl bg-obsidian-400 border border-gold-500/20 text-gold-300 hover:text-white flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-obsidian-400 border border-gold-500/15">
          <span className="text-xs text-gray-400 block">Total Lifetime Revenue</span>
          <h3 className="text-2xl font-extrabold text-gold-400 font-mono mt-1">
            ৳{(reports?.totalRevenue || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">সর্বমোট আয় (BDT)</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-400 border border-gold-500/15">
          <span className="text-xs text-gray-400 block">Total Completed Orders</span>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-1">
            {(reports?.totalOrders || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">সম্পূর্ণ সফল অর্ডার সংখ্যা</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-400 border border-gold-500/15">
          <span className="text-xs text-gray-400 block">Average Order Value (AOV)</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            ৳{(reports?.averageOrderValue || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">গড় প্রতি অর্ডারে খরচ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Items Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-obsidian-400 border border-gold-500/15 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-gold-400" />
            <span>Top Selling Dishes (সর্বাধিক বিক্রিত খাবার)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-gray-400 font-semibold border-b border-white/5">
                <tr>
                  <th className="pb-2">Dish Name</th>
                  <th className="pb-2">Qty Sold</th>
                  <th className="pb-2 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports?.topItems && reports.topItems.length > 0 ? (
                  reports.topItems.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-obsidian-300/30">
                      <td className="py-2.5 font-bengali">
                        <strong className="text-white block">{item._id}</strong>
                        <span className="text-[11px] text-gray-400">{item.nameEn}</span>
                      </td>
                      <td className="py-2.5 font-mono font-bold text-gold-400">
                        {item.totalQuantity} pcs
                      </td>
                      <td className="py-2.5 font-mono font-bold text-right text-white">
                        ৳{item.totalSales.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">
                      কোনো তথ্য পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods & Sources Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-obsidian-400 border border-gold-500/15 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-gold-400" />
              <span>Payment Methods Breakdown</span>
            </h3>

            <div className="space-y-2 pt-1">
              {reports?.paymentBreakdown && reports.paymentBreakdown.length > 0 ? (
                reports.paymentBreakdown.map((pm: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-obsidian-300/80 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-mono uppercase text-gray-300">
                      {pm._id ? pm._id.replace('_', ' ') : 'COD'}
                    </span>
                    <span className="font-mono font-bold text-gold-400">
                      ৳{pm.total.toLocaleString()} ({pm.count} orders)
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">তথ্য নেই</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
