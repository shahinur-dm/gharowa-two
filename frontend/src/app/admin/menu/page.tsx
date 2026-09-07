'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Copy,
  ExternalLink,
  Flame,
  Star,
  Sparkles,
  Filter,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { MenuItem, MenuCategory } from '../../../types';
import ImageUploadField from '../../../components/ImageUploadField';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [filterTag, setFilterTag] = useState<'all' | 'popular' | 'featured' | 'bestseller'>('all');
  const [sortBy, setSortBy] = useState<'displayOrder' | 'priceAsc' | 'priceDesc' | 'rating'>('displayOrder');

  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    slug: '',
    sku: '',
    category: '',
    price: 0,
    originalPrice: 0,
    descriptionBn: '',
    descriptionEn: '',
    shortDescriptionBn: '',
    shortDescriptionEn: '',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    galleryImages: [] as string[],
    spiceLevel: 1,
    isAvailable: true,
    isBestseller: false,
    isFeatured: false,
    isPopular: false,
    rating: 4.9,
    reviewsCount: 124,
    preparationTimeMinutes: 15,
    servingSize: '১ জন (1 Person)',
    ingredients: 'সুগন্ধি চাল, দেশি খাসি, ঘি, জয়ফল, এলাচ, দারুচিনি',
    calories: '480 kcal',
    protein: '22 g',
    carbs: '54 g',
    fat: '18 g',
    seoTitle: '',
    seoDescription: '',
    displayOrder: 0,
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
      sku: `GH-${Date.now().toString().slice(-4)}`,
      category: categories[0]?._id || '',
      price: 250,
      originalPrice: 280,
      descriptionBn: '',
      descriptionEn: '',
      shortDescriptionBn: '',
      shortDescriptionEn: '',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      galleryImages: [],
      spiceLevel: 1,
      isAvailable: true,
      isBestseller: false,
      isFeatured: false,
      isPopular: false,
      rating: 4.9,
      reviewsCount: 120,
      preparationTimeMinutes: 15,
      servingSize: '১ জন (1 Person)',
      ingredients: '',
      calories: '450 kcal',
      protein: '18 g',
      carbs: '52 g',
      fat: '15 g',
      seoTitle: '',
      seoDescription: '',
      displayOrder: items.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      nameBn: item.nameBn,
      nameEn: item.nameEn,
      slug: item.slug,
      sku: item.sku || `GH-${item._id.slice(-4)}`,
      category: typeof item.category === 'object' ? (item.category as any)._id : item.category,
      price: item.price,
      originalPrice: item.originalPrice || 0,
      descriptionBn: item.descriptionBn,
      descriptionEn: item.descriptionEn,
      shortDescriptionBn: item.shortDescriptionBn || '',
      shortDescriptionEn: item.shortDescriptionEn || '',
      image: item.image,
      galleryImages: item.galleryImages || [],
      spiceLevel: item.spiceLevel || 1,
      isAvailable: item.isAvailable,
      isBestseller: item.isBestseller || false,
      isFeatured: item.isFeatured || false,
      isPopular: item.isPopular || false,
      rating: item.rating || 4.9,
      reviewsCount: item.reviewsCount || 124,
      preparationTimeMinutes: item.preparationTimeMinutes || 15,
      servingSize: item.servingSize || '1 Person',
      ingredients: item.ingredients || '',
      calories: item.nutritionFacts?.calories || '450 kcal',
      protein: item.nutritionFacts?.protein || '18 g',
      carbs: item.nutritionFacts?.carbs || '52 g',
      fat: item.nutritionFacts?.fat || '15 g',
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
      displayOrder: item.displayOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = async (item: MenuItem) => {
    try {
      const duplicated = {
        ...item,
        nameEn: `${item.nameEn} (Copy)`,
        nameBn: `${item.nameBn} (কপি)`,
        slug: `${item.slug}-copy-${Date.now().toString().slice(-4)}`,
        sku: `GH-${Date.now().toString().slice(-4)}`,
        category: typeof item.category === 'object' ? (item.category as any)._id : item.category,
      };
      delete (duplicated as any)._id;

      const res: any = await api.post('/menu/admin/items', duplicated);
      if (res.success && res.data) {
        setItems((prev) => [res.data, ...prev]);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gharowa_cms_updated'));
        }
      }
    } catch (e: any) {
      alert(e.message || 'Duplicate failed');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res: any = await api.delete(`/menu/admin/items/${id}`);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i._id !== id));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gharowa_cms_updated'));
        }
      }
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayOrder: Number(formData.displayOrder),
        nutritionFacts: {
          calories: formData.calories,
          protein: formData.protein,
          carbs: formData.carbs,
          fat: formData.fat,
        },
      };

      if (editingItem) {
        const res: any = await api.put(`/menu/admin/items/${editingItem._id}`, payload);
        if (res.success && res.data) {
          setItems((prev) => prev.map((i) => (i._id === editingItem._id ? res.data : i)));
          setIsModalOpen(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gharowa_cms_updated'));
          }
        }
      } else {
        const res: any = await api.post('/menu/admin/items', payload);
        if (res.success && res.data) {
          setItems((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gharowa_cms_updated'));
          }
        }
      }
    } catch (err: any) {
      alert(err.message || 'Save failed');
    }
  };

  // Filtered & Sorted items
  const filteredItems = items
    .filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.nameBn.includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q));

      const catId = typeof item.category === 'object' ? (item.category as any)._id : item.category;
      const matchesCategory = selectedCategory === 'all' || catId === selectedCategory;

      const matchesAvailability =
        filterAvailability === 'all' ||
        (filterAvailability === 'available' && item.isAvailable) ||
        (filterAvailability === 'unavailable' && !item.isAvailable);

      const matchesTag =
        filterTag === 'all' ||
        (filterTag === 'popular' && (item.isPopular || item.isFeatured)) ||
        (filterTag === 'featured' && item.isFeatured) ||
        (filterTag === 'bestseller' && item.isBestseller);

      return matchesSearch && matchesCategory && matchesAvailability && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <Utensils className="w-5 h-5 text-[#900C19]" />
            <span>Menu & Product Management (খাবার ও প্রোডাক্ট তালিকা)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            খাবারের মূল্য, ছবি, রেটিং, গ্যালারি, স্টক ও জনপ্রিয় খাবার নিয়ন্ত্রণ করুন
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#900C19] hover:border-red-200 transition-all shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন খাবার যোগ করুন (Add Dish)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="খাবারের নাম বা SKU লিখে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-[#900C19]"
            >
              <option value="all">সব ক্যাটাগরি (All Categories)</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nameEn} ({c.nameBn})
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-[#900C19]"
            >
              <option value="all">সব ফিচার ট্যাগ</option>
              <option value="popular">🔥 Popular Dishes (জনপ্রিয়)</option>
              <option value="featured">✨ Featured (স্পেশাল)</option>
              <option value="bestseller">🏆 Bestseller (ঐতিহ্যের সেরা)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-[#900C19]"
            >
              <option value="displayOrder">সাজানোর ক্রম (Display Order)</option>
              <option value="priceAsc">মূল্য: কম থেকে বেশি (Price Low → High)</option>
              <option value="priceDesc">মূল্য: বেশি থেকে কম (Price High → Low)</option>
              <option value="rating">রেটিং: সর্বোচ্চ (Highest Rating)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            প্রদর্শিত হচ্ছে <strong>{filteredItems.length}</strong> / {items.length} টি খাবার
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterAvailability('all')}
              className={`hover:text-[#900C19] ${filterAvailability === 'all' ? 'font-semibold text-[#900C19]' : ''}`}
            >
              সব
            </button>
            <span>•</span>
            <button
              onClick={() => setFilterAvailability('available')}
              className={`hover:text-[#900C19] ${filterAvailability === 'available' ? 'font-semibold text-emerald-700' : ''}`}
            >
              ইন-স্টক ({items.filter((i) => i.isAvailable).length})
            </button>
            <span>•</span>
            <button
              onClick={() => setFilterAvailability('unavailable')}
              className={`hover:text-[#900C19] ${filterAvailability === 'unavailable' ? 'font-semibold text-rose-700' : ''}`}
            >
              আউট অব স্টক ({items.filter((i) => !i.isAvailable).length})
            </button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400 font-normal">লোড হচ্ছে...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">ছবি</th>
                  <th className="py-3.5 px-4">খাবারের নাম & SKU</th>
                  <th className="py-3.5 px-4">ক্যাটাগরি</th>
                  <th className="py-3.5 px-4">মূল্য (Price)</th>
                  <th className="py-3.5 px-4">রেটিং</th>
                  <th className="py-3.5 px-4">ট্যাগসমূহ</th>
                  <th className="py-3.5 px-4">স্টক স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-normal">
                      কোনো খাবার পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <Image src={item.image} alt={item.nameEn} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="font-semibold text-slate-900">{item.nameEn}</div>
                        <div className="text-[11px] text-slate-500 font-bengali font-normal">{item.nameBn}</div>
                        {item.sku && (
                          <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-normal">
                        {typeof item.category === 'object' ? (item.category as any).nameEn : item.category}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-[#900C19]">৳{item.price}</div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-[10px] text-slate-400 line-through font-mono">
                            ৳{item.originalPrice}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        ⭐ {item.rating || 4.9}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.isPopular && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                              🔥 Popular
                            </span>
                          )}
                          {item.isBestseller && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-50 text-[#900C19] border border-red-200 font-medium">
                              🏆 Bestseller
                            </span>
                          )}
                          {item.isFeatured && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                              ✨ Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleAvailability(item._id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {item.isAvailable ? '✓ ইন-স্টক (In Stock)' : 'স্টক শেষ (Out)'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/menu/${item.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="ওয়েবসাইটে দেখুন"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDuplicate(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="ডুপ্লিকেট করুন"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Advanced Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#900C19]" />
                <span>{editingItem ? 'খাবারের তথ্য সম্পাদনা (Edit Food)' : 'নতুন খাবার যোগ করুন (Add Food)'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              {/* Main Image Uploader */}
              <ImageUploadField
                label="Primary Dish Image (খাবারের প্রধান ছবি) *"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                helperText="High quality photo of the dish."
              />

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">খাবারের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="উদা: খাসির ভুনা খিচুড়ি"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Food Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Mutton Bhuna Khichuri"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>
              </div>

              {/* Category, SKU & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nameEn} ({c.nameBn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">SKU / কোড</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">বিক্রয় মূল্য (Price ৳) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ডিসকাউন্ট পূর্বের মূল্য (৳)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>
              </div>

              {/* Prep time, Serving Size, Spice Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">প্রস্তুতির সময় (Prep Time Mins)</label>
                  <input
                    type="number"
                    value={formData.preparationTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, preparationTimeMinutes: parseInt(e.target.value) || 15 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">পরিবেশনের পরিমাণ (Serving Size)</label>
                  <input
                    type="text"
                    value={formData.servingSize}
                    onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                    placeholder="১ জন (1 Person)"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ঝালের মাত্রা (Spice Level)</label>
                  <select
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData({ ...formData, spiceLevel: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  >
                    <option value={0}>ঝাল নেই (Mild 0)</option>
                    <option value={1}>হালকা ঝাল (Low Spice 1)</option>
                    <option value={2}>মাঝারি ঝাল (Medium Spice 2)</option>
                    <option value={3}>তীব্র ঝাল (Hot Spice 3)</option>
                  </select>
                </div>
              </div>

              {/* Ingredients & Descriptions */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">প্রধান উপকরণসমূহ (Ingredients)</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="খাসির মাংস, সুগন্ধি চিনিগুঁড়া চাল, গাওয়া ঘি, এলাচ, লবঙ্গ"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">সম্পূর্ণ বিবরণ (বাংলা)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionBn}
                    onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                    placeholder="ঘরোয়ার ঐতিহ্যবাহী রেসিপিতে রান্না করা..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Description (English)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Heritage slow-cooked delicacy..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>
              </div>

              {/* Badges & Feature Toggles */}
              <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded text-[#900C19] focus:ring-[#900C19]"
                  />
                  <span>🔥 Popular Dishes (হোমপেজে দেখাবে)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="rounded text-[#900C19] focus:ring-[#900C19]"
                  />
                  <span>🏆 Bestseller (ঐতিহ্যের সেরা)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#900C19] focus:ring-[#900C19]"
                  />
                  <span>✨ Featured (স্পেশাল)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-[#900C19] focus:ring-[#900C19]"
                  />
                  <span>✓ Available in Stock (অর্ডারের জন্য উন্মুক্ত)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-semibold text-xs shadow-2xs transition-all"
                >
                  সংরক্ষণ ও প্রকাশ করুন (Save & Publish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
