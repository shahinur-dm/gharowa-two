'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Clock, Star, ArrowRight, ShoppingBag } from 'lucide-react';
import { RestaurantSettings, HeroSlide } from '../types';
import { useLanguageStore } from '../store/languageStore';
import { api } from '../lib/api';

interface HeroSectionProps {
  settings?: RestaurantSettings | null;
}

const defaultHeroSlides: HeroSlide[] = [
  {
    _id: 'default-1',
    title: 'Mutton Khichuri',
    mainImageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    supportingImageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    badgeText: '1972',
    displayOrder: 1,
    slideDurationSeconds: 4,
    isActive: true,
  },
  {
    _id: 'default-2',
    title: 'Mutton Kacchi',
    mainImageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    supportingImageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    badgeText: '1972',
    displayOrder: 2,
    slideDurationSeconds: 4,
    isActive: true,
  },
  {
    _id: 'default-3',
    title: 'Mutton Leg Khichuri',
    mainImageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    supportingImageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
    badgeText: '1972',
    displayOrder: 3,
    slideDurationSeconds: 4,
    isActive: true,
  },
  {
    _id: 'default-4',
    title: 'Chicken Biryani',
    mainImageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    supportingImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    badgeText: '1972',
    displayOrder: 4,
    slideDurationSeconds: 4,
    isActive: true,
  },
];

export default function HeroSection({ settings }: HeroSectionProps) {
  const { language } = useLanguageStore();

  const [slides, setSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Left column static content
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

  const ctaText =
    language === 'bn'
      ? settings?.heroCtaTextBn || 'অর্ডার করুন'
      : settings?.heroCtaTextEn || 'Order Now';

  // Fetch dynamic hero slides
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await api.get('/hero-slides');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSlides(res.data);
        } else if (settings?.heroImageUrl) {
          // Fallback with custom settings image
          setSlides([
            {
              _id: 'setting-hero',
              title: title,
              mainImageUrl: settings.heroImageUrl,
              supportingImageUrl: settings.heroPouringImageUrl || '',
              badgeText: '1972',
              displayOrder: 1,
              slideDurationSeconds: 4,
              isActive: true,
            },
            ...defaultHeroSlides.slice(1),
          ]);
        }
      } catch (err) {
        console.warn('Failed to load dynamic hero slides:', err);
      }
    };

    fetchHeroSlides();

    if (typeof window !== 'undefined') {
      window.addEventListener('gharowa_cms_updated', fetchHeroSlides);
      return () => window.removeEventListener('gharowa_cms_updated', fetchHeroSlides);
    }
  }, [settings?.heroImageUrl, settings?.heroPouringImageUrl, title]);

  // Automatic slide rotation (ONE at a time with smooth transition)
  useEffect(() => {
    if (slides.length <= 1) return;

    const currentSlide = slides[currentSlideIndex] || slides[0];
    const duration = (currentSlide.slideDurationSeconds || 4) * 1000;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearInterval(interval);
  }, [slides, currentSlideIndex]);

  const activeSlide = slides[currentSlideIndex] || slides[0] || defaultHeroSlides[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#800A15] via-[#900C19] to-[#680811] text-white pt-24 sm:pt-20 lg:pt-22 pb-5 sm:pb-7 lg:pb-8 border-b border-white/10 font-sans">
      {/* Background Decorative Pattern & Warm Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-10 w-80 h-80 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* LEFT 50%: Hero Text & Actions (Completely Unchanged Content, Compact Proportions) */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4 text-center lg:text-left">
            {/* Top Authentic Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-[11px] sm:text-xs font-medium tracking-wider uppercase backdrop-blur-sm shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold tracking-tight text-white leading-tight font-sans">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm lg:text-[15px] text-white/90 font-bengali font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              {/* Order Now Button */}
              <Link
                href="/menu/mutton-khichuri"
                className="px-6 py-2.5 rounded-full bg-white hover:bg-amber-50 text-[#900C19] font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 flex items-center gap-2 tracking-normal"
              >
                <ShoppingBag className="w-4 h-4 text-[#900C19]" />
                <span>{ctaText}</span>
              </Link>

              {/* Explore Menu Button */}
              <Link
                href="/menu"
                className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm transition-all duration-300 flex items-center gap-2 tracking-normal"
              >
                <span>{language === 'bn' ? 'মেনু দেখুন' : 'Explore Menu'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Indicators Bar */}
            <div className="pt-3.5 border-t border-white/15 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-7 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">4.9 / 5.0</div>
                  <div className="text-[10px] sm:text-[11px] text-white/70 font-normal">
                    {language === 'bn' ? 'রেটিং' : 'Highly Rated'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-400/20 border border-red-400/40 flex items-center justify-center text-amber-300">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">#১ বেস্টসেলার</div>
                  <div className="text-[10px] sm:text-[11px] text-white/70 font-normal">
                    {language === 'bn' ? 'জনপ্রিয় খাবার' : 'Best Seller'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">৩০–৪৫ মিনিট</div>
                  <div className="text-[10px] sm:text-[11px] text-white/70 font-normal">
                    {language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Fast Delivery'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 50%: Dynamic Food Carousel / Slider Area */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-2 sm:py-3">
            {/* Ambient Base Glow */}
            <div className="absolute w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-amber-400/20 blur-2xl animate-pulse" />

            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
              {/* Main Hot Food Bowl Layer with Dynamic Image Fade Transition */}
              <div className="relative w-56 sm:w-72 md:w-80 lg:w-[300px] xl:w-[320px] h-56 sm:h-72 md:h-80 lg:h-[300px] xl:h-[320px] rounded-full p-2 bg-gradient-to-tr from-amber-600/40 via-amber-400/30 to-amber-200/20 shadow-2xl border border-amber-300/30">
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner border-4 border-[#4a080e] bg-slate-900">
                  {/* Dynamic Slide Image with Smooth Cross-Fade */}
                  {slides.map((slide, idx) => (
                    <div
                      key={slide._id || idx}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.mainImageUrl}
                        alt={slide.title || 'Gharowa food'}
                        className="w-full h-full object-cover scale-105 select-none"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                      {/* Subtle Dark Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                    </div>
                  ))}
                </div>

                {/* Steam Particles rising from bowl */}
                <div className="absolute -top-4 left-1/3 w-6 h-12 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-md steam-particle pointer-events-none" />
                <div className="absolute -top-6 left-1/2 w-8 h-16 bg-gradient-to-t from-white/35 to-transparent rounded-full blur-md steam-particle-2 pointer-events-none" />
                <div className="absolute -top-4 left-2/3 w-6 h-12 bg-gradient-to-t from-white/30 to-transparent rounded-full blur-md steam-particle-3 pointer-events-none" />
              </div>

              {/* Dynamic Small Supporting Image / Card (Top-Right) */}
              {activeSlide.supportingImageUrl && (
                <div className="absolute -top-2 sm:-top-4 right-2 sm:right-4 z-20 pointer-events-none transition-all duration-500">
                  <div className="relative w-20 sm:w-26 md:w-28 h-16 sm:h-20 md:h-22 rounded-2xl overflow-hidden border-2 border-amber-300/60 shadow-2xl bg-amber-900/60 transform -rotate-12 hover:rotate-0 transition-transform">
                    <img
                      src={activeSlide.supportingImageUrl}
                      alt="Supporting dish"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-transparent to-black/50" />
                  </div>
                </div>
              )}

              {/* Signature Heritage 1972 Badge Tag (Bottom-Left) */}
              <div className="absolute bottom-1 sm:bottom-2 left-2 sm:left-4 z-20 bg-[#800A15]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-400/30 shadow-xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xs">
                  {activeSlide.badgeText || '1972'}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">
                    {language === 'bn' ? 'খাঁটি খাসির ভুনা খিচুড়ি' : 'Authentic Mutton Khichuri'}
                  </div>
                  <div className="text-[9px] text-amber-200/80 leading-tight">
                    {language === 'bn' ? 'ঢাকার ঐতিহ্যের স্বাদ' : 'Heritage Taste of Dhaka'}
                  </div>
                </div>
              </div>

              {/* Slide Indicators / Dots */}
              {slides.length > 1 && (
                <div className="absolute -bottom-4 flex items-center gap-1.5 z-20">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentSlideIndex(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        dotIdx === currentSlideIndex
                          ? 'w-6 bg-amber-400'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
