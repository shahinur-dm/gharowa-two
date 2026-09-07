'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Utensils, RefreshCw, PieChart } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <BarChart3 className="w-5 h-5 text-[#900C19]" />
            <span>Sales & Financial Analytics (বিক্রয় ও আর্থিক প্রতিবেদন)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            সর্বমোট আয়, গড়ে প্রতিটি অর্ডারের মূল্য এবং জনপ্রিয় খাবারের বিশ্লেষণ
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#900C19] hover:border-red-200 flex items-center gap-2 text-xs font-medium shadow-2xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Total Lifetime Revenue</span>
          <h3 className="text-2xl font-semibold text-[#900C19] font-mono mt-1">
            ৳{(reports?.totalRevenue || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">সর্বমোট আয় (BDT)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Total Completed Orders</span>
          <h3 className="text-2xl font-semibold text-slate-900 font-mono mt-1">
            {(reports?.totalOrders || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">সম্পূর্ণ সফল অর্ডার সংখ্যা</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Average Order Value (AOV)</span>
          <h3 className="text-2xl font-semibold text-emerald-800 font-mono mt-1">
            ৳{(reports?.averageOrderValue || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">গড় প্রতি অর্ডারে খরচ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Items Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#900C19]" />
            <span>Top Selling Dishes (সর্বাধিক বিক্রিত খাবার)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-2.5">Dish Name</th>
                  <th className="pb-2.5">Qty Sold</th>
                  <th className="pb-2.5 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports?.topItems && reports.topItems.length > 0 ? (
                  reports.topItems.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 font-bengali">
                        <strong className="text-slate-900 font-semibold block">{item.nameBn}</strong>
                        <span className="text-[11px] text-slate-500 font-normal">{item.nameEn}</span>
                      </td>
                      <td className="py-2.5 font-mono font-semibold text-slate-900">{item.totalQuantity} pcs</td>
                      <td className="py-2.5 font-mono font-semibold text-[#900C19] text-right">
                        ৳{item.totalRevenue.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 font-normal">
                      কোনো রেকর্ড পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Sources Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#900C19]" />
            <span>Order Source Breakdown (অর্ডার চ্যানেল)</span>
          </h3>

          <div className="space-y-3 pt-2">
            {reports?.sourceBreakdown && reports.sourceBreakdown.length > 0 ? (
              reports.sourceBreakdown.map((s: any, idx: number) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 uppercase font-mono block">
                      {s._id || 'Website'}
                    </span>
                    <span className="text-slate-500 text-[11px] font-normal">{s.count} টি সফল অর্ডার</span>
                  </div>
                  <span className="font-mono font-semibold text-[#900C19]">
                    ৳{s.revenue.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 font-normal">
                কোনো চ্যানেল ডাটা নেই
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
