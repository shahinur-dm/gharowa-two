'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Filter, Utensils, ChevronRight, ArrowUpDown, Loader2 } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating'>('default');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(16);

  const defaultCategories = [
    { _id: 'cat-all', nameBn: 'সব খাবার', nameEn: 'All', slug: 'all', displayOrder: 0, isActive: true },
    { _id: 'cat-1', nameBn: 'খিচুড়ি', nameEn: 'Khichuri', slug: 'khichuri', displayOrder: 1, isActive: true },
    { _id: 'cat-2', nameBn: 'কাচ্চি ও বিরিয়ানি', nameEn: 'Biryani', slug: 'biryani', displayOrder: 2, isActive: true },
    { _id: 'cat-3', nameBn: 'তেহারি', nameEn: 'Tehari', slug: 'tehari', displayOrder: 3, isActive: true },
    { _id: 'cat-4', nameBn: 'পোলাও', nameEn: 'Polao', slug: 'polao', displayOrder: 4, isActive: true },
    { _id: 'cat-5', nameBn: 'খাসির মাংস', nameEn: 'Mutton', slug: 'mutton', displayOrder: 5, isActive: true },
    { _id: 'cat-6', nameBn: 'গরুর মাংস', nameEn: 'Beef', slug: 'beef', displayOrder: 6, isActive: true },
    { _id: 'cat-7', nameBn: 'চিকেন', nameEn: 'Chicken', slug: 'chicken', displayOrder: 7, isActive: true },
    { _id: 'cat-8', nameBn: 'মাছের পদ', nameEn: 'Fish', slug: 'fish', displayOrder: 8, isActive: true },
    { _id: 'cat-9', nameBn: 'সাদা ভাত ও ফ্রাইড রাইস', nameEn: 'Rice', slug: 'rice', displayOrder: 9, isActive: true },
    { _id: 'cat-10', nameBn: 'স্ন্যাক্স ও সমুচা', nameEn: 'Snacks', slug: 'snacks', displayOrder: 10, isActive: true },
    { _id: 'cat-11', nameBn: 'পানীয় ও বোরহানি', nameEn: 'Drinks', slug: 'drinks', displayOrder: 11, isActive: true },
    { _id: 'cat-12', nameBn: 'মিষ্টি ও ডেজার্ট', nameEn: 'Desserts', slug: 'desserts', displayOrder: 12, isActive: true },
    { _id: 'cat-13', nameBn: 'স্পেশাল কম্বো', nameEn: 'Combos', slug: 'combos', displayOrder: 13, isActive: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catRes, itemRes]: [any, any] = await Promise.all([
          api.get('/menu/categories'),
          api.get('/menu/items'),
        ]);

        if (catRes.success && catRes.data && catRes.data.length > 0) {
          setCategories([
            { _id: 'all', nameBn: 'সব খাবার', nameEn: 'All', slug: 'all', displayOrder: 0, isActive: true },
            ...catRes.data,
          ]);
        } else {
          setCategories(defaultCategories);
        }

        if (itemRes.success && itemRes.data && itemRes.data.length > 0) {
          setMenuItems(itemRes.data);
        }
      } catch (e) {
        console.warn('Error fetching menu items', e);
        setCategories(defaultCategories);
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
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return a.displayOrder - b.displayOrder;
  });

  const displayedItems = sortedItems.slice(0, visibleCount);

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header Banner matching Reference 3 */}
      <div className="bg-[#800A15] text-white py-12 px-4 text-center relative overflow-hidden border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-2 relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight">
            {language === 'bn' ? 'আমাদের সম্পূর্ণ খাবার মেনু' : 'Our Menu'}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-bengali">
            {language === 'bn'
              ? '১৯৭২ সালের ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, কাচ্চি, তেহারি ও সুস্বাদু বাঙালি খাবার'
              : 'Authentic 1972 recipes cooked with fresh ingredients and traditional spices.'}
          </p>

          <div className="text-xs text-amber-200/80 font-medium flex items-center justify-center gap-1.5 pt-2">
            <Link href="/" className="hover:text-white transition-colors">
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white font-bold">{language === 'bn' ? 'মেনু' : 'Menu'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 2. Controls Bar: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'খাবার খুঁজুন (যেমন: খাসি, বিরিয়ানি)...' : 'Search dishes (e.g. mutton, biryani)...'}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19] transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#900C19]" />
              <span>{language === 'bn' ? 'সর্ট করুন:' : 'Sort:'}</span>
            </div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#900C19]"
            >
              <option value="default">{language === 'bn' ? 'জনপ্রিয়তা' : 'Popularity'}</option>
              <option value="rating">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Highest Rated'}</option>
              <option value="price_asc">{language === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price_desc">{language === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* 3. Category Filter Pills matching Reference 3 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setVisibleCount(16);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                  isSelected
                    ? 'bg-[#900C19] text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            );
          })}
        </div>

        {/* 4. Food Cards Grid matching Reference 3 */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 text-[#900C19] animate-spin" />
            <p className="text-xs">{language === 'bn' ? 'মেনু লোড হচ্ছে...' : 'Loading menu...'}</p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {language === 'bn' ? 'কোনো খাবার পাওয়া যায়নি' : 'No items found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'bn'
                ? 'অন্য কোনো ক্যাটাগরি বা সার্চ কিওয়ার্ড দিয়ে চেষ্টা করুন।'
                : 'Try searching with a different keyword or selecting another category.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayedItems.map((dish) => (
                <DishCard key={dish._id} dish={dish} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < sortedItems.length && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-8 py-3 rounded-full border-2 border-[#900C19] text-[#900C19] hover:bg-[#900C19] hover:text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  {language === 'bn'
                    ? `আরও খাবার দেখুন (${sortedItems.length - visibleCount} বাকি)`
                    : `Load More (${sortedItems.length - visibleCount} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
