'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, Plus, AlertTriangle, ArrowUpDown, History, X, Check, RefreshCw } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-gold-400" />
            <span>Raw Inventory & Stock Management (ইনভেন্টরি স্টক)</span>
          </h1>
          <p className="text-xs text-gray-400">
            খাসির মাংস, চিনিগুঁড়া চাল, গাওয়া ঘি ও কাঁচামাল ট্র্যাকিং এবং লো-স্টক অ্যালার্ট
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="p-2.5 rounded-xl bg-obsidian-400 border border-gold-500/20 text-gold-300 hover:text-white flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ স্টক</span>
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>
            সতর্কতা: <strong>{lowStockCount}</strong> টি কাঁচামালের স্টক নির্ধারিত ন্যূনতম সীমার নিচে নেমেছে! দ্রুত রিস্টক করুন।
          </span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="rounded-2xl bg-obsidian-400 border border-gold-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-obsidian-300/80 text-gray-400 uppercase tracking-wider font-semibold border-b border-gold-500/10">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Min Threshold</th>
                <th className="p-4">Cost / Unit</th>
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
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    কোনো ইনভেন্টরি আইটেম পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-obsidian-300/40 transition-colors">
                    <td className="p-4">
                      <strong className="text-white block font-bengali">{item.nameBn}</strong>
                      <span className="text-[11px] text-gray-400">{item.nameEn}</span>
                    </td>
                    <td className="p-4 font-mono text-[11px] uppercase text-gray-400">
                      {item.category.replace('_', ' ')}
                    </td>
                    <td className="p-4 font-mono font-bold text-sm text-gold-400">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="p-4 font-mono text-gray-400">
                      {item.minStockThreshold} {item.unit}
                    </td>
                    <td className="p-4 font-mono">৳{item.costPerUnit} / {item.unit}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          item.status === 'in_stock'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'low_stock'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenAdjust(item)}
                        className="px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-obsidian-950 text-xs font-bold transition-all border border-gold-500/30"
                      >
                        স্টক সমন্বয়
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-obsidian-400 border border-gold-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <button
              onClick={() => setIsAdjustModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-obsidian-300 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base font-bold font-bengali text-white">
                স্টক সমন্বয়: {selectedItem.nameBn}
              </h2>
              <p className="text-xs text-gold-400 font-mono">
                বর্তমান স্টক: {selectedItem.currentStock} {selectedItem.unit}
              </p>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">সমন্বয়ের ধরণ *</label>
                <select
                  value={adjustData.type}
                  onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="purchase">Purchase (নতুন ক্রয় - স্টক বৃদ্ধি)</option>
                  <option value="adjustment">Stock Adjustment (সরাসরি সমন্বয়)</option>
                  <option value="waste">Kitchen Waste (নষ্ট / অপচয় - স্টক হ্রাস)</option>
                  <option value="return">Return (ফেরত)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">
                    পরিমাণ ({selectedItem.unit}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={adjustData.quantity}
                    onChange={(e) => setAdjustData({ ...adjustData, quantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">
                    একক মূল্য (BDT)
                  </label>
                  <input
                    type="number"
                    value={adjustData.unitCost}
                    onChange={(e) => setAdjustData({ ...adjustData, unitCost: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">কারণ / নোট</label>
                <input
                  type="text"
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs shadow-gold transition-all"
              >
                স্টক আপডেট সম্পন্ন করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
