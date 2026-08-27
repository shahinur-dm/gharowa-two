'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, Utensils, Flame, ArrowUpDown } from 'lucide-react';
import { MenuItem, MenuCategory } from '../../types';
import { useLanguageStore } from '../../store/languageStore';
import { useCartStore } from '../../store/cartStore';
import DishCard from '../../components/DishCard';
import { api } from '../../lib/api';

export default function MenuPage() {
  const { language } = useLanguageStore();
  const { openCart } = useCartStore();

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catRes, itemRes]: [any, any] = await Promise.all([
          api.get('/menu/categories'),
          api.get('/menu/items'),
        ]);

        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
        if (itemRes.success && itemRes.data) {
          setMenuItems(itemRes.data);
        }
      } catch (e) {
        console.warn('Error fetching menu items', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'all') {
      const itemCatSlug =
        typeof item.category === 'object' && item.category
          ? item.category.slug
          : item.category;
      if (itemCatSlug !== selectedCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBn = item.nameBn.toLowerCase().includes(q);
      const matchEn = item.nameEn.toLowerCase().includes(q);
      const matchDescBn = item.descriptionBn?.toLowerCase().includes(q);
      const matchDescEn = item.descriptionEn?.toLowerCase().includes(q);
      if (!matchBn && !matchEn && !matchDescBn && !matchDescEn) return false;
    }

    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return a.displayOrder - b.displayOrder;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs font-bold">
          <Utensils className="w-3.5 h-3.5 text-traditional-600" />
          <span>{language === 'bn' ? '১৯৭২ সালের খাঁটি ঘরোয়া রেসিপি' : 'Authentic 1972 Heritage Menu'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-bengali">
          {language === 'bn' ? 'ঘরোয়ার ঐতিহ্যের পূর্ণাঙ্গ মেনু' : 'Our Authentic Heritage Menu'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-bengali leading-relaxed">
          {language === 'bn'
            ? 'খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি, দম কাচ্চি, পদ্মার সরিষা ইলিশ ও বোরহানি — পছন্দের পদটি অর্ডার করুন।'
            : 'Select your favorite dishes and order directly via online cart or WhatsApp.'}
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'খাবারের নাম লিখে খুঁজুন...' : 'Search dishes...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-traditional-600 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-2xl text-xs text-slate-700 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-traditional-600" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="default">ডিফল্ট সাজানো / Default</option>
                <option value="price_asc">মূল্য: কম থেকে বেশি / Low to High</option>
                <option value="price_desc">মূল্য: বেশি থেকে কম / High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-traditional-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-traditional-700 border border-slate-200'
            }`}
          >
            {language === 'bn' ? 'সব খাবার' : 'All Dishes'}
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-traditional-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:text-traditional-700 border border-slate-200'
              }`}
            >
              {language === 'bn' ? cat.nameBn : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-80 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-bengali">
            {language === 'bn' ? 'কোনো খাবার পাওয়া যায়নি' : 'No dishes match your search'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'bn' ? 'অন্য কোনো নাম বা ক্যাটাগরি নির্বাচন করুন।' : 'Try searching for something else.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedItems.map((dish) => (
            <DishCard key={dish._id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
