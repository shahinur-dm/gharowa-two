'use client';

import React from 'react';
import Image from 'next/image';
import { Flame, Plus, Check, ShoppingBag, MessageCircle, Star } from 'lucide-react';
import { MenuItem } from '../types';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice, toBanglaNumber } from '../lib/bangla';

interface DishCardProps {
  dish: MenuItem;
  onInstantOrder?: (dish: MenuItem) => void;
}

export default function DishCard({ dish, onInstantOrder }: DishCardProps) {
  const { language } = useLanguageStore();
  const { items, addItem, openCart } = useCartStore();

  const cartItem = items.find((i) => i.menuItem._id === dish._id);
  const inCartQty = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(dish, 1);
  };

  const handleInstantWhatsApp = () => {
    addItem(dish, 1);
    if (onInstantOrder) {
      onInstantOrder(dish);
    } else {
      openCart();
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-traditional-300 transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between">
      {/* Dish Image with badges */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-100">
        <Image
          src={dish.image}
          alt={dish.nameEn}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Bestseller Badge */}
        {dish.isBestseller && (
          <div className="absolute top-3 left-3 bg-traditional-700 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-current text-amber-300" />
            <span>{language === 'bn' ? 'ঐতিহ্যের সেরা' : 'Bestseller'}</span>
          </div>
        )}

        {/* Spice Level Indicator */}
        {dish.spiceLevel > 0 && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-sm flex items-center gap-0.5 border border-slate-200">
            {Array.from({ length: dish.spiceLevel }).map((_, idx) => (
              <Flame key={idx} className="w-3.5 h-3.5 text-traditional-600 fill-traditional-600" />
            ))}
          </div>
        )}

        {/* Dietary Tag */}
        {dish.dietaryTags && dish.dietaryTags.length > 0 && (
          <div className="absolute bottom-2.5 left-3 bg-slate-900/80 backdrop-blur-sm text-[10px] text-amber-300 font-semibold px-2.5 py-0.5 rounded shadow-sm">
            {dish.dietaryTags[0]}
          </div>
        )}
      </div>

      {/* Dish Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bengali group-hover:text-traditional-700 transition-colors line-clamp-1">
              {language === 'bn' ? dish.nameBn : dish.nameEn}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            {language === 'bn' ? dish.nameEn : dish.nameBn}
          </p>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {language === 'bn' ? dish.descriptionBn : dish.descriptionEn}
          </p>
        </div>

        {/* Pricing & Order Actions */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          {/* Price & Stock */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-traditional-700 font-mono">
                {formatPrice(dish.price, language)}
              </span>
              {dish.originalPrice && dish.originalPrice > dish.price && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatPrice(dish.originalPrice, language)}
                </span>
              )}
            </div>
            {dish.isAvailable ? (
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {language === 'bn' ? 'উপলব্ধ' : 'Available'}
              </span>
            ) : (
              <span className="text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {language === 'bn' ? 'স্টক শেষ' : 'Out of stock'}
              </span>
            )}
          </div>

          {/* Action Buttons: Order Now & Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            {/* Add To Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!dish.isAvailable}
              className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                inCartQty > 0
                  ? 'bg-traditional-50 border border-traditional-600 text-traditional-800 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {inCartQty > 0 ? (
                <>
                  <Check className="w-3.5 h-3.5 text-traditional-700" />
                  <span>
                    {language === 'bn' ? `${toBanglaNumber(inCartQty)} টি কার্টে` : `${inCartQty} in Cart`}
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কার্টে যোগ' : 'Add to Cart'}</span>
                </>
              )}
            </button>

            {/* Prominent Red Traditional Order Now Button */}
            <button
              onClick={handleInstantWhatsApp}
              disabled={!dish.isAvailable}
              className="w-full py-2.5 px-2 rounded-xl bg-traditional-700 hover:bg-traditional-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
