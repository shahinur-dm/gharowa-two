'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/customers', { search: search.trim() || undefined });
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (e) {
      console.warn('Customers fetch error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <Users className="w-5 h-5 text-[#900C19]" />
            <span>Customer Directory & Lifetime Value (গ্রাহক তালিকা)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            গ্রাহকের মোট অর্ডার সংখ্যা, মোট খরচ এবং যোগাযোগের বিস্তারিত তথ্য
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#900C19] hover:border-red-200 flex items-center gap-2 text-xs font-medium shadow-2xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchCustomers();
        }}
        className="relative w-full sm:w-80"
      >
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="গ্রাহকের নাম বা ফোন নম্বর..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19] focus:ring-1 focus:ring-[#900C19]"
        />
      </form>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Primary Address</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spent</th>
                <th className="p-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-normal">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-normal">
                    কোনো গ্রাহকের রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <strong className="text-slate-900 font-semibold block font-bengali">{c.name}</strong>
                    </td>
                    <td className="p-4 font-mono font-medium text-[#900C19]">{c.phone}</td>
                    <td className="p-4 max-w-xs truncate text-slate-600 font-normal">{c.address || '—'}</td>
                    <td className="p-4 font-mono font-semibold text-slate-900">
                      {c.totalOrders || 0} Orders
                    </td>
                    <td className="p-4 font-mono font-semibold text-[#900C19] text-sm">
                      ৳{(c.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">
                      {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
