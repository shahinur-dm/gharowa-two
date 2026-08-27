'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, MapPin, ShoppingBag, Star, RefreshCw } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-400" />
            <span>Customer Directory & Lifetime Value (গ্রাহক তালিকা)</span>
          </h1>
          <p className="text-xs text-gray-400">
            গ্রাহকের মোট অর্ডার সংখ্যা, মোট খরচ এবং যোগাযোগের বিস্তারিত তথ্য
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="p-2.5 rounded-xl bg-obsidian-400 border border-gold-500/20 text-gold-300 hover:text-white flex items-center gap-2 text-xs font-semibold"
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
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="গ্রাহকের নাম বা ফোন নম্বর লিখে খুঁজুন..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-400 border border-gold-500/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
        />
      </form>

      {/* Table */}
      <div className="rounded-2xl bg-obsidian-400 border border-gold-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-obsidian-300/80 text-gray-400 uppercase tracking-wider font-semibold border-b border-gold-500/10">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Primary Address</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spent</th>
                <th className="p-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    কোনো গ্রাহকের রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-obsidian-300/40 transition-colors">
                    <td className="p-4">
                      <strong className="text-white block font-bengali">{c.name}</strong>
                    </td>
                    <td className="p-4 font-mono font-semibold text-gold-400">{c.phone}</td>
                    <td className="p-4 max-w-xs truncate text-gray-300">{c.address || '—'}</td>
                    <td className="p-4 font-mono font-bold text-white">
                      {c.totalOrders || 0} Orders
                    </td>
                    <td className="p-4 font-mono font-extrabold text-gold-400 text-sm">
                      ৳{(c.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-gray-400">
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
