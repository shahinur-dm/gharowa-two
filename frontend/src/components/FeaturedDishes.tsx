'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { MenuItem } from '../types';
import DishCard from './DishCard';
import { useLanguageStore } from '../store/languageStore';

interface FeaturedDishesProps {
  dishes: MenuItem[];
}

export default function FeaturedDishes({ dishes }: FeaturedDishesProps) {
  const { language } = useLanguageStore();

  // Pick top 4 featured or bestseller dishes
  const popularList = dishes.filter((d) => d.isBestseller || d.isFeatured).slice(0, 4);
  const fallbackList = dishes.slice(0, 4);
  const displayed = popularList.length >= 4 ? popularList : fallbackList;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#900C19] uppercase mb-1">
            {language === 'bn' ? 'জনপ্রিয় খাবার তালিকা' : 'POPULAR DISHES'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            {language === 'bn' ? 'আমাদের বিশেষ জনপ্রিয় পদসমূহ' : 'Our Popular Dishes'}
          </h2>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#900C19]/30 text-[#900C19] hover:bg-[#900C19] hover:text-white font-bold text-xs transition-all shadow-sm group"
        >
          <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4 Column Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayed.map((dish) => (
          <DishCard key={dish._id} dish={dish} />
        ))}
      </div>
    </section>
  );
}
