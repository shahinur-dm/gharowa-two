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
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const defaultCategories = [
    { _id: 'cat-all', nameBn: 'সব খাবার', nameEn: 'All', slug: 'all', displayOrder: 0, isActive: true },
    { _id: 'cat-1', nameBn: 'খিচুড়ি', nameEn: 'Khichuri', slug: 'khichuri', displayOrder: 1, isActive: true },
    { _id: 'cat-2', nameBn: 'বিরিয়ানি', nameEn: 'Biryani', slug: 'biryani', displayOrder: 2, isActive: true },
    { _id: 'cat-3', nameBn: 'পোলাও ও ভাত', nameEn: 'Rice', slug: 'rice', displayOrder: 3, isActive: true },
    { _id: 'cat-4', nameBn: 'খাসি', nameEn: 'Mutton', slug: 'mutton', displayOrder: 4, isActive: true },
    { _id: 'cat-5', nameBn: 'চিকেন', nameEn: 'Chicken', slug: 'chicken', displayOrder: 5, isActive: true },
    { _id: 'cat-6', nameBn: 'বিফ', nameEn: 'Beef', slug: 'beef', displayOrder: 6, isActive: true },
    { _id: 'cat-7', nameBn: 'পানীয়', nameEn: 'Drinks', slug: 'drinks', displayOrder: 7, isActive: true },
    { _id: 'cat-8', nameBn: 'ডেজার্ট', nameEn: 'Desserts', slug: 'desserts', displayOrder: 8, isActive: true },
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
      <div className="bg-[#800A15] text-white py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-2 relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif">
            {language === 'bn' ? 'আমাদের মেনু' : 'Our Menu'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-300 font-semibold">{language === 'bn' ? 'মেনু' : 'Menu'}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Filter Pills (Reference 3) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setVisibleCount(12);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#900C19] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:text-[#900C19] border border-slate-200 shadow-sm'
                }`}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'খাবারের নাম লিখে খুঁজুন...' : 'Search dishes...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19] shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-2xl text-xs text-slate-700 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#900C19]" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="default">ডিফল্ট সাজানো / Default</option>
                <option value="price_asc">মূল্য: কম থেকে বেশি / Price: Low to High</option>
                <option value="price_desc">মূল্য: বেশি থেকে কম / Price: High to Low</option>
                <option value="rating">সেরা রেটিং / Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Food Grid (3-4 Columns on Desktop, 2 on Tablet/Mobile) */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-72 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">
              {language === 'bn' ? 'কোন খাবার খুঁজে পাওয়া যায়নি' : 'No dishes found'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'অন্য কোনো ক্যাটাগরি বা ভিন্ন নাম লিখে চেষ্টা করুন।'
                : 'Try searching with a different keyword or category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedItems.map((dish) => (
              <DishCard key={dish._id} dish={dish} />
            ))}
          </div>
        )}

        {/* Load More Button (Reference 3) */}
        {sortedItems.length > visibleCount && (
          <div className="text-center pt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-8 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold shadow-sm hover:border-[#900C19] hover:text-[#900C19] transition-all"
            >
              {language === 'bn' ? 'আরও খাবার দেখুন' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
