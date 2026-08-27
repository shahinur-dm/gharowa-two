'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Check, X, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';
import { Coupon } from '../../../types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    titleBn: '',
    titleEn: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 300,
    maxDiscountAmount: 100,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/coupons/admin');
      if (res.success && res.data) {
        setCoupons(res.data);
      }
    } catch (e) {
      console.warn('Coupons fetch error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/coupons/admin', {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        maxDiscountAmount: Number(formData.maxDiscountAmount) || undefined,
      });
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Coupon creation failed');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('কুপনটি মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/coupons/admin/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-gold-400" />
            <span>Discount Coupons & Promo Engine (কুপন ব্যবস্থাপনা)</span>
          </h1>
          <p className="text-xs text-gray-400">
            প্রচারমূলক প্রোমোকোড তৈরি, শতকরা বা ফ্ল্যাট মূল্যছাড় এবং ব্যবহারের সীমা নিয়ন্ত্রণ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-2 shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কুপন তৈরি করুন</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl bg-obsidian-400 border border-gold-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-obsidian-300/80 text-gray-400 uppercase tracking-wider font-semibold border-b border-gold-500/10">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Title</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    কোনো কুপন তৈরি করা হয়নি
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-obsidian-300/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-gold-400 text-sm">
                      {c.code}
                    </td>
                    <td className="p-4 font-bengali font-semibold text-white">
                      {c.titleBn}
                      <span className="block text-[11px] text-gray-400 font-normal">{c.titleEn}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`}
                    </td>
                    <td className="p-4 font-mono">৳{c.minOrderAmount}</td>
                    <td className="p-4 font-mono text-[11px] text-gray-400">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          c.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c._id!)}
                        className="p-1.5 rounded-lg bg-obsidian-300 hover:bg-rose-500 hover:text-white text-gray-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-obsidian-400 border border-gold-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-obsidian-300 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold font-bengali text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-gold-400" />
              <span>নতুন কুপন তৈরি করুন</span>
            </h2>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">কুপন কোড (উদা: GH1972) *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white font-mono uppercase focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">বাংলা শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">English Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">ছাড়ের ধরন *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="percentage">শতকরা (%) Percentage</option>
                    <option value="fixed">সরাসরি টাকা (৳) Flat BDT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">ডিসকাউন্ট মান *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">ন্যূনতম অর্ডার (BDT)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">মেয়াদ শেষ তারিখ</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs shadow-gold transition-all"
              >
                কুপন সক্রিয় করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
