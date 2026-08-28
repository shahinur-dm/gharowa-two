'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Flame, Clock, Star, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { RestaurantSettings } from '../types';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';

interface HeroSectionProps {
  settings?: RestaurantSettings | null;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const { language } = useLanguageStore();
  const { openCart } = useCartStore();

  const title =
    language === 'bn'
      ? settings?.heroTitleBn || 'ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি'
      : settings?.heroTitleEn || 'MUTTON KHICHURI';

  const subtitle =
    language === 'bn'
      ? settings?.heroSubtitleBn || 'আসল স্বাদ, মোহময় সুবাস ও নিপুণভাবে রান্না করা খাসির নরম মাংস।'
      : settings?.heroSubtitleEn || 'Traditional taste, rich aroma and perfectly cooked mutton.';

  const badgeText =
    language === 'bn'
      ? settings?.heroBadgeBn || 'খাঁটি ও ঐতিহ্যবাহী'
      : settings?.heroBadgeEn || 'AUTHENTIC';

  const heroImage =
    settings?.heroImageUrl ||
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop';

  const pouringImage =
    settings?.heroPouringImageUrl ||
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop';

  const ctaText =
    language === 'bn'
      ? settings?.heroCtaTextBn || 'অর্ডার করুন'
      : settings?.heroCtaTextEn || 'Order Now';

  const ctaLink = settings?.heroCtaLink || '/menu';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#800A15] via-[#900C19] to-[#680811] text-white pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-white/10">
      {/* Background Decorative Pattern & Warm Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Hero Text & Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Top Authentic Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold tracking-widest uppercase backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{badgeText}</span>
            </div>

            {/* Main Bold Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-serif">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/85 font-bengali max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Order Now Button */}
              <Link
                href="/menu/mutton-khichuri"
                className="px-8 py-3.5 rounded-full bg-white hover:bg-amber-50 text-[#900C19] font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#900C19]" />
                <span>{ctaText}</span>
              </Link>

              {/* Explore Menu Button */}
              <Link
                href="/menu"
                className="px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
              >
                <span>{language === 'bn' ? 'মেনু দেখুন' : 'Explore Menu'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Indicators Bar */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">4.9 / 5.0</div>
                  <div className="text-[11px] text-white/70">{language === 'bn' ? 'রেটিং' : 'Highly Rated'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-400/20 border border-red-400/40 flex items-center justify-center text-amber-300">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">#১ বেস্টসেলার</div>
                  <div className="text-[11px] text-white/70">{language === 'bn' ? 'জনপ্রিয় খাবার' : 'Best Seller'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">৩০–৪৫ মিনিট</div>
                  <div className="text-[11px] text-white/70">{language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Fast Delivery'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2D Mutton Khichuri Pouring Animation Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6">
            {/* Ambient Dish Base Glow */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-amber-400/20 blur-2xl animate-pulse" />

            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              {/* Main Hot Khichuri Bowl Layer */}
              <div className="relative w-72 sm:w-96 h-72 sm:h-96 rounded-full p-2 bg-gradient-to-tr from-amber-600/40 via-amber-400/30 to-amber-200/20 shadow-2xl border border-amber-300/30 animate-float-slow">
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner border-4 border-[#4a080e]">
                  <Image
                    src={heroImage}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover scale-105"
                  />
                  {/* Subtle Dark Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                </div>

                {/* Steam Particles rising from bowl */}
                <div className="absolute -top-6 left-1/3 w-8 h-16 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-md steam-particle pointer-events-none" />
                <div className="absolute -top-10 left-1/2 w-10 h-20 bg-gradient-to-t from-white/35 to-transparent rounded-full blur-md steam-particle-2 pointer-events-none" />
                <div className="absolute -top-6 left-2/3 w-8 h-16 bg-gradient-to-t from-white/30 to-transparent rounded-full blur-md steam-particle-3 pointer-events-none" />
              </div>

              {/* Elevated Serving Pot Pouring Stream (2D Animation Layer) */}
              <div className="absolute -top-6 sm:-top-10 right-4 sm:right-10 z-20 pointer-events-none">
                {/* Brass Pot */}
                <div className="relative w-28 sm:w-36 h-24 sm:h-32 transform -rotate-25 transition-transform duration-700 hover:rotate-[-30deg]">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-amber-300/60 shadow-2xl bg-amber-900/60">
                    <Image
                      src={pouringImage}
                      alt="Pouring Khichuri"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-transparent to-black/50" />
                  </div>

                  {/* Golden khichuri stream flowing down */}
                  <div className="absolute top-[80%] left-6 w-12 h-28 bg-gradient-to-b from-amber-400 via-amber-500/90 to-amber-600/80 rounded-b-full blur-[1px] shadow-lg opacity-90 animate-steam" />
                </div>
              </div>

              {/* Signature Taste Badge Tag */}
              <div className="absolute bottom-2 sm:bottom-4 left-4 sm:left-6 z-20 bg-[#800A15]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-400/30 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-sm">
                  1972
                </div>
                <div>
                  <div className="text-xs font-bold text-white">খাঁটি খাসির ভুনা খিচুড়ি</div>
                  <div className="text-[10px] text-amber-200/80">ঢাকার ঐতিহ্যের স্বাদ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
