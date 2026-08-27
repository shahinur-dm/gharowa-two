'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Utensils, Plus, Edit2, Trash2, Check, X, Sparkles, Flame, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { api } from '../../../lib/api';
import { MenuItem, MenuCategory } from '../../../types';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    slug: '',
    category: '',
    price: 0,
    originalPrice: 0,
    descriptionBn: '',
    descriptionEn: '',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 1,
    isAvailable: true,
    isBestseller: false,
    isFeatured: false,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemRes, catRes]: [any, any] = await Promise.all([
        api.get('/menu/admin/items'),
        api.get('/menu/admin/categories'),
      ]);
      if (itemRes.success && itemRes.data) {
        setItems(itemRes.data);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: catRes.data[0]._id }));
        }
      }
    } catch (e) {
      console.warn('Error fetching admin menu', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async (id: string) => {
    try {
      const res: any = await api.patch(`/menu/admin/items/${id}/availability`);
      if (res.success && res.data) {
        setItems((prev) =>
          prev.map((item) => (item._id === id ? { ...item, isAvailable: res.data.isAvailable } : item))
        );
      }
    } catch (e: any) {
      alert(e.message || 'Toggle failed');
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      nameBn: '',
      nameEn: '',
      slug: '',
      category: categories[0]?._id || '',
      price: 0,
      originalPrice: 0,
      descriptionBn: '',
      descriptionEn: '',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      spiceLevel: 1,
      isAvailable: true,
      isBestseller: false,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    const catId = typeof item.category === 'object' ? item.category._id : item.category;
    setFormData({
      nameBn: item.nameBn,
      nameEn: item.nameEn,
      slug: item.slug,
      category: catId,
      price: item.price,
      originalPrice: item.originalPrice || 0,
      descriptionBn: item.descriptionBn || '',
      descriptionEn: item.descriptionEn || '',
      image: item.image,
      spiceLevel: item.spiceLevel || 1,
      isAvailable: item.isAvailable,
      isBestseller: item.isBestseller,
      isFeatured: item.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.nameEn.toLowerCase().replace(/\s+/g, '-'),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || undefined,
        spiceLevel: Number(formData.spiceLevel),
      };

      if (editingItem) {
        await api.put(`/menu/admin/items/${editingItem._id}`, payload);
      } else {
        await api.post('/menu/admin/items', payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই মেনু আইটেমটি মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/menu/admin/items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-gold-400" />
            <span>Menu Items Management (মেনু ব্যবস্থাপনা)</span>
          </h1>
          <p className="text-xs text-gray-400">
            খাবারের মূল্য পরিবর্তন, নতুন পদ যুক্তকরণ এবং স্টক প্রাপ্যতা নিয়ন্ত্রণ
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-2 shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন খাবার যোগ করুন</span>
        </button>
      </div>

      {/* Items Table */}
      <div className="rounded-2xl bg-obsidian-400 border border-gold-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-obsidian-300/80 text-gray-400 uppercase tracking-wider font-semibold border-b border-gold-500/10">
              <tr>
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Spice</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    কোনো মেনু আইটেম পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const catName =
                    typeof item.category === 'object' && item.category
                      ? item.category.nameBn
                      : 'সাধারণ';
                  return (
                    <tr key={item._id} className="hover:bg-obsidian-300/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-obsidian-600 shrink-0">
                            <Image src={item.image} alt={item.nameEn} fill className="object-cover" />
                          </div>
                          <div>
                            <strong className="text-white block font-bengali">{item.nameBn}</strong>
                            <span className="text-[11px] text-gray-400">{item.nameEn}</span>
                            {item.isBestseller && (
                              <span className="inline-block text-[9px] font-bold text-gold-400 bg-gold-500/10 px-1.5 py-0.2 rounded border border-gold-500/20 ml-1">
                                Bestseller
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bengali">{catName}</td>
                      <td className="p-4 font-mono font-bold text-gold-400">
                        ৳{item.price}
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="block text-[10px] text-gray-500 line-through">
                            ৳{item.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-0.5 text-red-500">
                          {Array.from({ length: item.spiceLevel || 1 }).map((_, i) => (
                            <Flame key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleAvailability(item._id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                            item.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{item.isAvailable ? 'Available' : 'Out of Stock'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg bg-obsidian-300 hover:bg-gold-500 hover:text-obsidian-950 text-gray-300 transition-colors"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-1.5 rounded-lg bg-obsidian-300 hover:bg-rose-500 hover:text-white text-gray-400 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-obsidian-400 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-4 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-obsidian-300 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold font-bengali text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-gold-400" />
              <span>{editingItem ? 'মেনু আইটেম সম্পাদনা' : 'নতুন মেনু আইটেম যুক্ত করুন'}</span>
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">বাংলা নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="খাসির ভুনা খিচুড়ি"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">English Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Mutton Bhuna Khichuri"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">মূল্য (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">অরিজিনাল প্রাইস (ঐচ্ছিক)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">ছবির লিঙ্ক (Image URL) *</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">বাংলা বিবরণ</label>
                <textarea
                  rows={2}
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-obsidian-300 border border-gold-500/15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-gold-500"
                  />
                  <span>উপলব্ধ (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-obsidian-300 border border-gold-500/15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="rounded text-gold-500"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-obsidian-300 border border-gold-500/15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-gold-500"
                  />
                  <span>Featured</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs shadow-gold transition-all"
              >
                {editingItem ? 'সংরক্ষণ করুন / Update Dish' : 'যুক্ত করুন / Create Dish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
