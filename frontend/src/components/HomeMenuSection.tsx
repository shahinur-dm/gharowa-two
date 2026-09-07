'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';
import DishCard from './DishCard';
import { useLanguageStore } from '../store/languageStore';
import { api } from '../lib/api';

interface HomeMenuProps {
  dishes: MenuItem[];
}

export default function HomeMenuSection({ dishes }: HomeMenuProps) {
  const { language } = useLanguageStore();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(8);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await api.get('/menu/categories');
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (e) {
        console.warn('Failed to fetch categories for home menu', e);
      }
    };
    fetchCategories();
  }, []);

  const filteredDishes = useMemo(() => {
    if (activeCategory === 'all') return dishes;
    return dishes.filter((dish) => {
      const catSlug = typeof dish.category === 'object' ? dish.category.slug : dish.category;
      return catSlug === activeCategory;
    });
  }, [dishes, activeCategory]);

  const displayedDishes = filteredDishes.slice(0, visibleCount);

  return (
    <section className="pt-4 pb-6 space-y-4">
      {/* Deep Red "Our Menu" Section Banner */}
      <div className="bg-[#800A15] text-white py-7 px-4 text-center relative overflow-hidden border-y border-white/10">
        <div className="max-w-4xl mx-auto space-y-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold font-sans tracking-tight">
            {language === 'bn' ? 'আমাদের সম্পূর্ণ মেনু' : 'Our Menu'}
          </h2>
          <div className="text-xs text-amber-200/80 font-normal flex items-center justify-center gap-1.5 font-sans">
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white font-medium">{language === 'bn' ? 'মেনু' : 'Menu'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          <button
            onClick={() => {
              setActiveCategory('all');
              setVisibleCount(8);
            }}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 shadow-sm ${
              activeCategory === 'all'
                ? 'bg-[#900C19] text-white shadow-md font-semibold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {language === 'bn' ? 'সব খাবার' : 'All Items'}
          </button>

          {categories.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setVisibleCount(8);
                }}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 shadow-sm ${
                  isSelected
                    ? 'bg-[#900C19] text-white shadow-md font-semibold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            );
          })}
        </div>

        {/* Responsive Food Cards Grid */}
        {displayedDishes.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm font-normal">
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
          <div className="text-center pt-2 sm:pt-3">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-8 py-2.5 rounded-full border border-[#900C19] text-[#900C19] hover:bg-[#900C19] hover:text-white font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              {language === 'bn' ? 'আরও খাবার দেখুন (Load More)' : 'Load More'}
            </button>
          </div>
        ) : (
          <div className="text-center pt-2 sm:pt-3">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#900C19] hover:bg-[#780813] text-white font-medium text-xs sm:text-sm shadow-md transition-all active:scale-95"
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
