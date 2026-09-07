'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Sparkles,
  Filter,
  Utensils,
  ChevronRight,
  ArrowUpDown,
  Loader2,
  FileText,
  X,
  Eye,
} from 'lucide-react';
import { MenuItem, MenuCategory, RestaurantSettings } from '../../types';
import { useLanguageStore } from '../../store/languageStore';
import { useCartStore } from '../../store/cartStore';
import DishCard from '../../components/DishCard';
import { api } from '../../lib/api';

export default function MenuPage() {
  const { language } = useLanguageStore();
  const { openCart } = useCartStore();

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating'>('default');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [isMenuBoardModalOpen, setIsMenuBoardModalOpen] = useState<boolean>(false);

  const defaultCategories = [
    { _id: 'cat-all', nameBn: 'সব খাবার', nameEn: 'All', slug: 'all', displayOrder: 0, isActive: true },
    { _id: 'cat-1', nameBn: 'খিচুড়ি ও বিরিয়ানি', nameEn: 'Khichuri & Biryani', slug: 'khichuri-biryani', displayOrder: 1, isActive: true },
    { _id: 'cat-2', nameBn: 'সকালের নাস্তা', nameEn: 'Breakfast', slug: 'breakfast', displayOrder: 2, isActive: true },
    { _id: 'cat-3', nameBn: 'দুপুর ও রাতের খাবার', nameEn: 'Lunch & Dinner', slug: 'main-course', displayOrder: 3, isActive: true },
    { _id: 'cat-4', nameBn: 'মাছের পদ', nameEn: 'Fish Items', slug: 'fish', displayOrder: 4, isActive: true },
    { _id: 'cat-5', nameBn: 'কাবাব ও শর্মা', nameEn: 'Kabab & Shawarma', slug: 'kabab-grill', displayOrder: 5, isActive: true },
    { _id: 'cat-6', nameBn: 'শাক ও ভর্তা', nameEn: 'Vorta & Greens', slug: 'vorta-greens', displayOrder: 6, isActive: true },
    { _id: 'cat-7', nameBn: 'নান, পরটা ও ভাত', nameEn: 'Breads & Rice', slug: 'breads-rice', displayOrder: 7, isActive: true },
    { _id: 'cat-8', nameBn: 'ডেজার্ট ও মিষ্টি', nameEn: 'Desserts', slug: 'desserts', displayOrder: 8, isActive: true },
    { _id: 'cat-9', nameBn: 'পানীয় ও বোরহানি', nameEn: 'Drinks & Juices', slug: 'drinks', displayOrder: 9, isActive: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catRes, itemRes, setRes]: [any, any, any] = await Promise.all([
          api.get('/menu/categories'),
          api.get('/menu/items'),
          api.get('/settings'),
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

        if (setRes.success && setRes.data) {
          setSettings(setRes.data);
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
      {/* 1. Header Banner */}
      <div className="bg-[#800A15] text-white py-12 px-4 text-center relative overflow-hidden border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-2 relative z-10">
          <div className="text-[11px] font-medium tracking-wider text-amber-300 uppercase font-sans">
            GHAROWA HOTEL & RESTAURANT • SINCE 1972
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold font-sans tracking-tight">
            {language === 'bn' ? 'খাবারের সম্পূর্ণ মূল্য তালিকা ও মেনু' : 'Our Food Menu & Price List'}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-bengali font-normal">
            {language === 'bn'
              ? 'মতিঝিলের ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি, কাচ্চি, সরিষা ইলিশ, কাবাব ও স্পেশাল বোরহানি।'
              : 'Authentic 1972 recipes cooked with fresh ingredients and traditional spices in Motijheel, Dhaka.'}
          </p>

          <div className="flex items-center justify-center gap-4 pt-3">
            <div className="text-xs text-amber-200/80 font-normal flex items-center justify-center gap-1.5 font-sans">
              <Link href="/" className="hover:text-white transition-colors">
                {language === 'bn' ? 'হোম' : 'Home'}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-white font-medium">{language === 'bn' ? 'মেনু তালিকা' : 'Menu'}</span>
            </div>

            {/* Optional Menu Board Image Preview Trigger */}
            {settings?.menuBoardImageUrl && settings?.isMenuBoardEnabled && (
              <button
                onClick={() => setIsMenuBoardModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-medium text-[11px] backdrop-blur-sm transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'মূল্য তালিকা বোর্ড দেখুন' : 'View Menu Board'}</span>
              </button>
            )}
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
              placeholder={language === 'bn' ? 'খাবার খুঁজুন (যেমন: খাসির ভুনা, কাচ্চি, বোরহানি)...' : 'Search dishes (e.g. mutton, kacchi, borhani)...'}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19] transition-all font-bengali"
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
              <option value="default">{language === 'bn' ? 'মেনু ক্রম' : 'Default Order'}</option>
              <option value="rating">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Highest Rated'}</option>
              <option value="price_asc">{language === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price_desc">{language === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* 3. Category Filter Pills matching Reference 3 & Board */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setVisibleCount(20);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm font-bengali ${
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
            <h3 className="text-base font-bold text-slate-800 font-bengali">
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
                  onClick={() => setVisibleCount((prev) => prev + 16)}
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

      {/* Optional Physical Menu Board Lightbox Modal */}
      {isMenuBoardModalOpen && settings?.menuBoardImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white text-xs font-medium font-sans">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Gharowa Hotel & Restaurant — Official Menu Board</span>
              </div>
              <button
                onClick={() => setIsMenuBoardModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-gray-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black">
              <Image
                src={settings.menuBoardImageUrl}
                alt="Gharowa Hotel & Restaurant Official Price List Board"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
