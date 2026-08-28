'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { MenuItem } from '../types';
import DishCard from './DishCard';
import { useLanguageStore } from '../store/languageStore';

interface HomeMenuProps {
  dishes: MenuItem[];
}

export default function HomeMenuSection({ dishes }: HomeMenuProps) {
  const { language } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const categories = [
    { key: 'All', labelBn: 'সবগুলো', labelEn: 'All' },
    { key: 'Khichuri', labelBn: 'খিচুড়ি', labelEn: 'Khichuri' },
    { key: 'Biryani', labelBn: 'বিরিয়ানি', labelEn: 'Biryani' },
    { key: 'Rice', labelBn: 'পোলাও ও ভাত', labelEn: 'Rice' },
    { key: 'Mutton', labelBn: 'খাসি', labelEn: 'Mutton' },
    { key: 'Chicken', labelBn: 'মুরগি', labelEn: 'Chicken' },
    { key: 'Beef', labelBn: 'গরু', labelEn: 'Beef' },
    { key: 'Drinks', labelBn: 'পানীয় ও বোরহানি', labelEn: 'Drinks' },
    { key: 'Desserts', labelBn: 'ডেজার্ট', labelEn: 'Desserts' },
  ];

  const filteredDishes = useMemo(() => {
    if (activeCategory === 'All') return dishes;
    const catLower = activeCategory.toLowerCase();
    return dishes.filter((dish) => {
      const itemCat =
        typeof dish.category === 'object'
          ? (dish.category.nameEn || '').toLowerCase()
          : (dish.category || '').toLowerCase();
      const name = (dish.nameEn || '').toLowerCase();
      return itemCat.includes(catLower) || name.includes(catLower);
    });
  }, [dishes, activeCategory]);

  const displayedDishes = filteredDishes.slice(0, visibleCount);

  return (
    <section className="pt-6 pb-12 space-y-6">
      {/* Deep Red "Our Menu" Section Banner (Matching Reference 2) */}
      <div className="bg-[#800A15] text-white py-10 px-4 text-center relative overflow-hidden border-y border-white/10">
        <div className="max-w-4xl mx-auto space-y-2 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
            {language === 'bn' ? 'আমাদের সম্পূর্ণ মেনু' : 'Our Menu'}
          </h2>
          <div className="text-xs text-amber-200/80 font-medium flex items-center justify-center gap-1.5">
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white font-semibold">{language === 'bn' ? 'মেনু' : 'Menu'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Pill Filters (Matching Reference 2 & 3) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setVisibleCount(8);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                  isSelected
                    ? 'bg-[#900C19] text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {language === 'bn' ? cat.labelBn : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Responsive Food Cards Grid (Desktop 4-col, Tablet 2-3 col, Mobile 2-col) */}
        {displayedDishes.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো খাবার পাওয়া যায়নি' : 'No dishes found in this category.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedDishes.map((dish) => (
              <DishCard key={dish._id} dish={dish} />
            ))}
          </div>
        )}

        {/* Load More / View All Menu Button */}
        {visibleCount < filteredDishes.length ? (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-8 py-2.5 rounded-full border-2 border-[#900C19] text-[#900C19] hover:bg-[#900C19] hover:text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              {language === 'bn' ? 'আরও খাবার দেখুন (Load More)' : 'Load More'}
            </button>
          </div>
        ) : (
          <div className="text-center pt-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#900C19] hover:bg-[#780813] text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ মেনু ব্রাউজ করুন' : 'Browse Full Menu Page'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
