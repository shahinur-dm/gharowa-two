'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Plus, Check, Flame } from 'lucide-react';
import { MenuItem } from '../types';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice, toBanglaNumber } from '../lib/bangla';

interface DishCardProps {
  dish: MenuItem;
}

export default function DishCard({ dish }: DishCardProps) {
  const { language } = useLanguageStore();
  const { items, addItem } = useCartStore();

  const cartItem = items.find((i) => i.menuItem._id === dish._id);
  const inCartQty = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(dish, 1);
  };

  const rating = dish.rating || 4.8;
  const reviewsCount = dish.reviewsCount || 85;

  return (
    <Link
      href={`/menu/${dish.slug || dish._id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-red-200 transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between"
    >
      {/* Food Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={dish.image}
          alt={dish.nameEn}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Bestseller / Popular Badge */}
        {dish.isBestseller ? (
          <div className="absolute top-2.5 left-2.5 bg-[#900C19] text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-300 fill-current" />
            <span>{language === 'bn' ? 'বেস্টসেলার' : 'Best Seller'}</span>
          </div>
        ) : dish.isFeatured ? (
          <div className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-md">
            <span>{language === 'bn' ? 'স্পেশাল' : 'Popular'}</span>
          </div>
        ) : null}

        {/* Spice Level indicator */}
        {dish.spiceLevel > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
            {Array.from({ length: Math.min(dish.spiceLevel, 3) }).map((_, idx) => (
              <span key={idx} className="text-[10px]">🌶️</span>
            ))}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Dish Name (16-17px, 500-600 weight) */}
          <h3 className="text-[15px] sm:text-[17px] font-semibold text-slate-900 font-bengali group-hover:text-[#900C19] transition-colors line-clamp-1">
            {language === 'bn' ? dish.nameBn : dish.nameEn}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-slate-800 text-xs">{rating}</span>
            <span className="text-[11px] text-slate-400 font-normal">({reviewsCount})</span>
          </div>

          {/* Short description */}
          <p className="text-xs text-slate-500 font-normal line-clamp-2 mt-1 leading-relaxed">
            {language === 'bn' ? dish.descriptionBn : dish.descriptionEn}
          </p>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-semibold text-slate-900 font-mono">
              ৳{language === 'bn' ? toBanglaNumber(dish.price) : dish.price}
            </span>
            {dish.originalPrice && dish.originalPrice > dish.price && (
              <span className="text-[11px] text-slate-400 line-through font-mono">
                ৳{language === 'bn' ? toBanglaNumber(dish.originalPrice) : dish.originalPrice}
              </span>
            )}
          </div>

          {/* Red Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!dish.isAvailable}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 flex items-center gap-1 shadow-sm ${
              inCartQty > 0
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                : 'bg-[#900C19] hover:bg-[#780813] text-white'
            }`}
          >
            {inCartQty > 0 ? (
              <>
                <Check className="w-3 h-3" />
                <span>{language === 'bn' ? `${toBanglaNumber(inCartQty)} যোগ` : `${inCartQty} in Cart`}</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <span>{language === 'bn' ? 'যোগ' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
