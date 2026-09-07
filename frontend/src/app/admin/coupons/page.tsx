'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <Tag className="w-5 h-5 text-[#900C19]" />
            <span>Discount Coupons & Promo Engine (কুপন ব্যবস্থাপনা)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            প্রচারমূলক প্রোমোকোড তৈরি, শতকরা বা ফ্ল্যাট মূল্যছাড় এবং ব্যবহারের সীমা নিয়ন্ত্রণ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-medium text-xs flex items-center gap-2 shadow-2xs transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কুপন তৈরি করুন</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Title</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min. Order</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                    কোনো সক্রিয় কুপন পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-[#900C19] border border-red-200 text-xs">
                        {c.code}
                      </span>
                    </td>
                    <td className="p-4 font-bengali">
                      <strong className="text-slate-900 font-semibold block">{c.titleBn}</strong>
                      <span className="text-[11px] text-slate-500 font-normal">{c.titleEn}</span>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-900">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue} FLAT`}
                    </td>
                    <td className="p-4 font-mono text-slate-600">৳{c.minOrderAmount}</td>
                    <td className="p-4 font-mono text-slate-500">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {c.isActive ? '✓ সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c._id!)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                        title="মুছে ফেলুন"
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

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col font-sans">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#900C19]" />
                <span>নতুন প্রোমোকোড তৈরি করুন</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="flex flex-col flex-1 min-h-0 text-xs">
              <div className="overflow-y-auto p-4 sm:p-6 space-y-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">কুপন কোড (Promo Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="উদা: GHAROWA50"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 uppercase font-mono font-semibold focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">শিরোনাম (বাংলা) *</label>
                    <input
                      type="text"
                      required
                      value={formData.titleBn}
                      onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                      placeholder="উদা: স্পেশাল ৫০ টাকা ছাড়"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Special 50 BDT Off"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">ডিসকাউন্ট টাইপ *</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    >
                      <option value="percentage">শতকরা (%) Percentage</option>
                      <option value="fixed">স্থির পরিমাণ (৳) Flat Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">মূল্যছাড়ের পরিমাণ *</label>
                    <input
                      type="number"
                      required
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">ন্যূনতম অর্ডার (৳)</label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">মেয়াদ শেষ হওয়ার তারিখ</label>
                    <input
                      type="date"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 sm:px-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-semibold text-xs shadow-2xs transition-all"
                >
                  কুপন তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
