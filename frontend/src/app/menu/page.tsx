'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, Utensils, Flame, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
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

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    // Category match
    if (selectedCategory !== 'all') {
      const itemCatSlug =
        typeof item.category === 'object' && item.category
          ? item.category.slug
          : item.category;
      if (itemCatSlug !== selectedCategory) return false;
    }

    // Search match
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

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return a.displayOrder - b.displayOrder;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <Utensils className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? '১৯৭২ সালের খাঁটি রেসিপি' : 'Authentic 1972 Heritage Menu'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-bengali">
          {language === 'bn' ? 'ঘরোয়ার ঐতিহ্যের মেনু' : 'Our Heritage Menu'}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 font-bengali leading-relaxed">
          {language === 'bn'
            ? 'খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি, কাচ্চি, সরিষা ইলিশ থেকে শুরু করে স্পেশাল বোরহানি — পছন্দের খাবারটি নির্বাচন করুন।'
            : 'Explore our legendary Mutton Bhuna Khichuri, Kacchi, Shorshe Ilish, and refreshing Borhani.'}
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'খাবারের নাম লিখে খুঁজুন...' : 'Search dishes...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-obsidian-400 border border-gold-500/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-obsidian-400 border border-gold-500/20 px-3 py-2 rounded-2xl text-xs text-gray-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-gold-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
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
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold'
                : 'bg-obsidian-400 text-gray-300 hover:text-white border border-gold-500/15 hover:border-gold-500/40'
            }`}
          >
            {language === 'bn' ? 'সব খাবার' : 'All Dishes'}
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold'
                  : 'bg-obsidian-400 text-gray-300 hover:text-white border border-gold-500/15 hover:border-gold-500/40'
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
              className="h-80 rounded-2xl bg-obsidian-400/50 border border-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-obsidian-400/40 rounded-3xl border border-white/5">
          <div className="w-12 h-12 rounded-full bg-obsidian-300 border border-gold-500/20 flex items-center justify-center mx-auto text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-bengali">
            {language === 'bn' ? 'কোনো খাবার পাওয়া যায়নি' : 'No dishes match your search'}
          </h3>
          <p className="text-xs text-gray-400">
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
