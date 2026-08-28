'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Flame,
  Star,
  ToggleLeft,
  ToggleRight,
  Layers,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { MenuItem, MenuCategory, PortionOption, AddOnOption } from '../../../types';
import ImageUploadField from '../../../components/ImageUploadField';

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
    rating: 4.9,
    reviewsCount: 124,
    calories: '450 kcal',
    protein: '18 g',
    carbs: '52 g',
    fat: '15 g',
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
      rating: 4.9,
      reviewsCount: 124,
      calories: '450 kcal',
      protein: '18 g',
      carbs: '52 g',
      fat: '15 g',
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
      rating: item.rating || 4.9,
      reviewsCount: item.reviewsCount || 124,
      calories: item.nutritionFacts?.calories || '450 kcal',
      protein: item.nutritionFacts?.protein || '18 g',
      carbs: item.nutritionFacts?.carbs || '52 g',
      fat: item.nutritionFacts?.fat || '15 g',
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
        rating: Number(formData.rating),
        reviewsCount: Number(formData.reviewsCount),
        nutritionFacts: {
          calories: formData.calories,
          protein: formData.protein,
          carbs: formData.carbs,
          fat: formData.fat,
        },
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <span>Food Menu & Products Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            খাবারের ছবি পরিবর্তন, আপলোড, মূল্য ও বৈশিষ্ট্যসমূহ সম্পাদনা করুন
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-2xl bg-[#900C19] hover:bg-[#780813] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন খাবার যোগ করুন (Add Dish)</span>
        </button>
      </div>

      {/* Items Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-gray-400">লোড হচ্ছে...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-slate-950 text-gray-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">ছবি</th>
                  <th className="py-3 px-4">খাবারের নাম</th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4">মূল্য</th>
                  <th className="py-3 px-4">রেটিং</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800">
                        <Image src={item.image} alt={item.nameEn} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{item.nameEn}</div>
                      <div className="text-[11px] text-gray-400 font-bengali">{item.nameBn}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {typeof item.category === 'object' ? item.category.nameEn : item.category}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">
                      ৳{item.price}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-300">
                      ⭐ {item.rating || 4.9}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(item._id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.isAvailable ? 'উপলব্ধ (Active)' : 'স্টক শেষ (Out)'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>{editingItem ? 'খাবারের তথ্য সম্পাদনা' : 'নতুন খাবার যোগ করুন'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              {/* Image Uploader */}
              <ImageUploadField
                label="Food Image (খাবারের ছবি আপলোড বা URL)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                helperText="Directly upload an image file or provide a web URL."
              />

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">খাবারের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Food Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nameEn} ({c.nameBn})
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
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">আগের মূল্য / ছাড় (BDT)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-300 mb-1">বিবরণ (বাংলা / English)</label>
                <textarea
                  rows={2}
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Rating & Nutrition */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">রেটিং (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Calories</label>
                  <input
                    type="text"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Protein</label>
                  <input
                    type="text"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Carbs</label>
                  <input
                    type="text"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              {/* Flags: Bestseller, Featured, Availability */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span className="text-gray-300">Bestseller (বেস্টসেলার)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span className="text-gray-300">Featured (জনপ্রিয়)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span className="text-gray-300">Available (অর্ডারযোগ্য)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-gray-300 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#900C19] hover:bg-[#780813] text-white font-bold"
                >
                  সংরক্ষণ করুন (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
