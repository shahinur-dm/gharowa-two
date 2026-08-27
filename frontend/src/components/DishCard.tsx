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
    <div className="group relative bg-obsidian-400 rounded-2xl overflow-hidden border border-gold-500/15 hover:border-gold-500/45 transition-all duration-300 hover:shadow-gold flex flex-col justify-between">
      {/* Dish Image with badges */}
      <div className="relative w-full h-52 overflow-hidden bg-obsidian-600">
        <Image
          src={dish.image}
          alt={dish.nameEn}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-500 via-transparent to-transparent opacity-80" />

        {/* Bestseller Badge */}
        {dish.isBestseller && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-gold-500 text-obsidian-950 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-obsidian-950" />
            <span>{language === 'bn' ? 'বেস্টসেলার' : 'Bestseller'}</span>
          </div>
        )}

        {/* Spice Level Indicator */}
        {dish.spiceLevel > 0 && (
          <div className="absolute top-3 right-3 bg-obsidian-900/80 backdrop-blur-md px-2 py-1 rounded-full border border-red-500/30 flex items-center gap-0.5">
            {Array.from({ length: dish.spiceLevel }).map((_, idx) => (
              <Flame key={idx} className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            ))}
          </div>
        )}

        {/* Dietary Tag */}
        {dish.dietaryTags && dish.dietaryTags.length > 0 && (
          <div className="absolute bottom-2.5 left-3 bg-obsidian-900/70 backdrop-blur-sm text-[10px] text-gold-300 font-medium px-2 py-0.5 rounded border border-gold-500/20">
            {dish.dietaryTags[0]}
          </div>
        )}
      </div>

      {/* Dish Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-white font-bengali group-hover:text-gold-400 transition-colors line-clamp-1">
              {language === 'bn' ? dish.nameBn : dish.nameEn}
            </h3>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            {language === 'bn' ? dish.nameEn : dish.nameBn}
          </p>

          <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
            {language === 'bn' ? dish.descriptionBn : dish.descriptionEn}
          </p>
        </div>

        {/* Pricing & Order Actions */}
        <div className="pt-3 border-t border-white/5 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-gold-400">
                {formatPrice(dish.price, language)}
              </span>
              {dish.originalPrice && dish.originalPrice > dish.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(dish.originalPrice, language)}
                </span>
              )}
            </div>
            {dish.isAvailable ? (
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {language === 'bn' ? 'উপলব্ধ' : 'Available'}
              </span>
            ) : (
              <span className="text-[11px] text-rose-400 font-medium">
                {language === 'bn' ? 'স্টক শেষ' : 'Out of stock'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Add To Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!dish.isAvailable}
              className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                inCartQty > 0
                  ? 'bg-gold-500/20 border border-gold-500 text-gold-300'
                  : 'bg-obsidian-300 hover:bg-obsidian-200 border border-gold-500/20 text-gray-200 hover:text-white'
              }`}
            >
              {inCartQty > 0 ? (
                <>
                  <Check className="w-3.5 h-3.5 text-gold-400" />
                  <span>
                    {language === 'bn' ? `${toBanglaNumber(inCartQty)} টি যোগ করা` : `${inCartQty} in Cart`}
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কার্টে যোগ' : 'Add to Cart'}</span>
                </>
              )}
            </button>

            {/* Instant WhatsApp Order */}
            <button
              onClick={handleInstantWhatsApp}
              disabled={!dish.isAvailable}
              className="w-full py-2 px-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="WhatsApp-এ অর্ডার করুন"
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
