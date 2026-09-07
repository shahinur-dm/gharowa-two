'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { MenuItem } from '../types';
import DishCard from './DishCard';
import { useLanguageStore } from '../store/languageStore';

interface FeaturedDishesProps {
  dishes: MenuItem[];
}

export default function FeaturedDishes({ dishes }: FeaturedDishesProps) {
  const { language } = useLanguageStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pick top popular & bestseller dishes (at least 4-8 items)
  const popularList = dishes.filter((d) => d.isBestseller || d.isFeatured);
  const displayed = popularList.length >= 4 ? popularList : dishes.slice(0, 8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-center sm:text-left">
        <div>
          <div className="text-[11px] font-medium tracking-wider text-[#900C19] uppercase mb-1 font-sans">
            {language === 'bn' ? 'জনপ্রিয় খাবার তালিকা' : 'POPULAR DISHES'}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-slate-900 font-sans tracking-tight">
            {language === 'bn' ? 'আমাদের বিশেষ জনপ্রিয় পদসমূহ' : 'Our Popular Dishes'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation Arrows for Carousel */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm hover:border-[#900C19] hover:text-[#900C19] transition-all"
              aria-label="Previous dishes"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm hover:border-[#900C19] hover:text-[#900C19] transition-all"
              aria-label="Next dishes"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#900C19]/30 text-[#900C19] hover:bg-[#900C19] hover:text-white font-medium text-xs transition-all shadow-sm group"
          >
            <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Responsive Cards Grid / Horizontal Slider */}
      <div
        ref={scrollRef}
        className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory"
      >
        {displayed.map((dish) => (
          <div key={dish._id} className="min-w-[240px] sm:min-w-0 snap-start flex-1">
            <DishCard dish={dish} />
          </div>
        ))}
      </div>
    </section>
  );
}
