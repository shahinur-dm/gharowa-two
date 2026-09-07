'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, ArrowUpDown, X, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';
import { InventoryItem } from '../../../types';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [adjustData, setAdjustData] = useState({
    type: 'purchase',
    quantity: 10,
    unitCost: 0,
    reason: 'সাপ্তাহিক নতুন কাঁচামাল ক্রয়',
  });

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/inventory/items');
      if (res.success && res.data) {
        setItems(res.data);
        setLowStockCount(res.lowStockCount || 0);
      }
    } catch (e) {
      console.warn('Inventory fetch error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustData({
      type: 'purchase',
      quantity: 10,
      unitCost: item.costPerUnit || 0,
      reason: 'নতুন স্টক যুক্তকরণ',
    });
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      await api.post(`/inventory/items/${selectedItem._id}/adjust`, {
        type: adjustData.type,
        quantity: Number(adjustData.quantity),
        unitCost: Number(adjustData.unitCost),
        reason: adjustData.reason,
      });

      setIsAdjustModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Adjustment failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <Boxes className="w-5 h-5 text-[#900C19]" />
            <span>Raw Inventory & Stock Management (ইনভেন্টরি স্টক)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            খাসির মাংস, চিনিগুঁড়া চাল, গাওয়া ঘি ও কাঁচামাল ট্র্যাকিং এবং লো-স্টক অ্যালার্ট
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#900C19] hover:border-red-200 flex items-center gap-2 text-xs font-medium shadow-2xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ স্টক</span>
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            সতর্কতা: <strong>{lowStockCount}</strong> টি কাঁচামালের স্টক নির্ধারিত ন্যূনতম সীমার নিচে নেমেছে! দ্রুত রিস্টক করুন।
          </span>
        </div>
      )}

      {/* Inventory Items Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="p-4">উপাদান / Item</th>
                <th className="p-4">ক্যাটাগরি</th>
                <th className="p-4">বর্তমান মজুদ</th>
                <th className="p-4">ন্যূনতম সীমা</th>
                <th className="p-4">একক খরচ (Cost)</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                    কোনো ইনভেন্টরি ডাটা পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isLow = item.currentStock <= item.minStockThreshold;
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bengali">
                        <strong className="text-slate-900 font-semibold block">{item.nameBn}</strong>
                        <span className="text-[11px] text-slate-500 font-sans font-normal">{item.nameEn}</span>
                      </td>
                      <td className="p-4 text-slate-600 font-normal capitalize">{item.category}</td>
                      <td className="p-4 font-mono font-semibold text-slate-900 text-sm">
                        {item.currentStock} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-500">
                        {item.minStockThreshold} {item.unit}
                      </td>
                      <td className="p-4 font-mono font-semibold text-[#900C19]">
                        ৳{item.costPerUnit || 0}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium border inline-flex items-center gap-1 ${
                            isLow
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isLow ? '⚠️ লো স্টক (Low)' : '✓ পর্যাপ্ত (Good)'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(item)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#900C19] hover:text-white text-slate-700 text-xs font-medium transition-all inline-flex items-center gap-1"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          <span>স্টক সমন্বয়</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col font-sans">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#900C19]" />
                <span>স্টক সমন্বয়: {selectedItem.nameBn}</span>
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="flex flex-col flex-1 min-h-0 text-xs">
              <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">অ্যাকশন টাইপ *</label>
                  <select
                    value={adjustData.type}
                    onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  >
                    <option value="purchase">নতুন ক্রয় / ইনওয়ার্ড স্টক (+) (Purchase)</option>
                    <option value="usage">কিচেনে ব্যবহার / অপচয় (-) (Kitchen Usage)</option>
                    <option value="wastage">নষ্ট / মেয়াদোত্তীর্ণ (-) (Wastage)</option>
                    <option value="adjustment">স্টক সংশোধন (Manual Adjustment)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      পরিমাণ ({selectedItem.unit}) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={adjustData.quantity}
                      onChange={(e) => setAdjustData({ ...adjustData, quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">একক ক্রয়মূল্য (৳)</label>
                    <input
                      type="number"
                      value={adjustData.unitCost}
                      onChange={(e) => setAdjustData({ ...adjustData, unitCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">মন্তব্য / কারণ</label>
                  <input
                    type="text"
                    value={adjustData.reason}
                    onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                    placeholder="উদা: মতিঝিল কাঁচাবাজার থেকে খাসির মাংস ডেলিভারি"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 sm:px-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-semibold text-xs shadow-2xs transition-all"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
