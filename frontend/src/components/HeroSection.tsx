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
    title: 'MUTTON KHICHURI',
    titleBn: 'ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি',
    subtitleEn: 'Traditional taste, rich aroma and perfectly cooked mutton.',
    subtitleBn: 'আসল স্বাদ, মোহময় সুবাস ও নিপুণভাবে রান্না করা খাসির নরম মাংস।',
    mainImageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop',
    badgeText: 'AUTHENTIC',
    badgeBn: 'খাঁটি ও ঐতিহ্যবাহী',
    mediaType: 'image',
    displayOrder: 1,
    slideDurationSeconds: 4,
    isActive: true,
  },
  {
    _id: 'default-2',
    title: 'MUTTON KACCHI',
    titleBn: 'স্পেশাল খাসির কাচ্চি বিরিয়ানি',
    subtitleEn: 'Slow-cooked tender mutton layered with aromatic basmati rice & potato.',
    subtitleBn: 'সুগন্ধি বাসমতী চাল ও আলুর সাথে দমে রান্না করা নরম খাসির কাচ্চি।',
    mainImageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
    badgeText: 'AUTHENTIC',
    badgeBn: 'খাঁটি ও ঐতিহ্যবাহী',
    mediaType: 'image',
    displayOrder: 2,
    slideDurationSeconds: 4,
    isActive: true,
  },
  {
    _id: 'default-3',
    title: 'MUTTON LEG KHICHURI',
    titleBn: 'খাসির লেগ খিচুড়ি',
    subtitleEn: 'Whole mutton shank cooked in aromatic spiced bhuna khichuri.',
    subtitleBn: 'আস্ত খাসির লেগ পিস দিয়ে ভুনা ঐতিহ্যবাহী স্পেশাল খিচুড়ি।',
    mainImageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1200&auto=format&fit=crop',
    badgeText: 'AUTHENTIC',
    badgeBn: 'খাঁটি ও ঐতিহ্যবাহী',
    mediaType: 'image',
    displayOrder: 3,
    slideDurationSeconds: 4,
    isActive: true,
  },
  {
    _id: 'default-4',
    title: 'CHICKEN BIRYANI',
    titleBn: 'স্পেশাল চিকেন বিরিয়ানি ও কাবাব',
    subtitleEn: 'Royal spiced chicken biryani served with mouthwatering aroma.',
    subtitleBn: 'ঘরোয়ার স্পেশাল মসলায় তৈরি সুস্বাদু চিকেন বিরিয়ানি।',
    mainImageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop',
    badgeText: 'AUTHENTIC',
    badgeBn: 'খাঁটি ও ঐতিহ্যবাহী',
    mediaType: 'image',
    displayOrder: 4,
    slideDurationSeconds: 4,
    isActive: true,
  },
];

export default function HeroSection({ settings }: HeroSectionProps) {
  const { language } = useLanguageStore();

  const [slides, setSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Fallback content from settings
  const fallbackTitle =
    language === 'bn'
      ? settings?.heroTitleBn || 'ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি'
      : settings?.heroTitleEn || 'MUTTON KHICHURI';

  const fallbackSubtitle =
    language === 'bn'
      ? settings?.heroSubtitleBn || 'আসল স্বাদ, মোহময় সুবাস ও নিপুণভাবে রান্না করা খাসির নরম মাংস।'
      : settings?.heroSubtitleEn || 'Traditional taste, rich aroma and perfectly cooked mutton.';

  const fallbackBadge =
    language === 'bn'
      ? settings?.heroBadgeBn || 'খাঁটি ও ঐতিহ্যবাহী'
      : settings?.heroBadgeEn || 'AUTHENTIC';

  const ctaText =
    language === 'bn'
      ? settings?.heroCtaTextBn || 'অর্ডার করুন'
      : settings?.heroCtaTextEn || 'Order Now';

  const ctaLink = settings?.heroCtaLink || '/menu/mutton-khichuri';

  // Fetch dynamic hero slides
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await api.get('/hero-slides');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSlides(res.data);
        } else if (settings?.heroImageUrl || settings?.heroVideoUrl) {
          // Fallback with custom settings media
          setSlides([
            {
              _id: 'setting-hero',
              title: settings.heroTitleEn || 'MUTTON KHICHURI',
              titleBn: settings.heroTitleBn || 'ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি',
              subtitleEn: settings.heroSubtitleEn || 'Traditional taste, rich aroma and perfectly cooked mutton.',
              subtitleBn: settings.heroSubtitleBn || 'আসল স্বাদ, মোহময় সুবাস ও নিপুণভাবে রান্না করা খাসির নরম মাংস।',
              badgeText: settings.heroBadgeEn || 'AUTHENTIC',
              badgeBn: settings.heroBadgeBn || 'খাঁটি ও ঐতিহ্যবাহী',
              mediaType: settings.heroMediaType === 'video' ? 'video' : 'image',
              mainImageUrl: settings.heroImageUrl || defaultHeroSlides[0].mainImageUrl,
              videoUrl: settings.heroVideoUrl || '',
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
  }, [settings?.heroImageUrl, settings?.heroVideoUrl, settings?.heroMediaType, settings?.heroTitleBn, settings?.heroTitleEn, settings?.heroSubtitleBn, settings?.heroSubtitleEn, settings?.heroBadgeBn, settings?.heroBadgeEn]);

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

  // Dynamic headline, subtitle, badge from active slide with settings fallback
  const displayTitle =
    language === 'bn'
      ? activeSlide.titleBn || activeSlide.title || fallbackTitle
      : activeSlide.title || fallbackTitle;

  const displaySubtitle =
    language === 'bn'
      ? activeSlide.subtitleBn || fallbackSubtitle
      : activeSlide.subtitleEn || fallbackSubtitle;

  const displayBadge =
    language === 'bn'
      ? activeSlide.badgeBn || activeSlide.badgeText || fallbackBadge
      : activeSlide.badgeText || fallbackBadge;

  return (
    <section className="relative overflow-hidden bg-[#780914] text-white pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10 font-sans min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
      {/* 1. FULL-WIDTH CONTINUOUS BACKGROUND MEDIA (Images / Video across the entire Hero) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, idx) => {
          const isVideo = slide.mediaType === 'video' || Boolean(slide.videoUrl);
          const isCurrent = idx === currentSlideIndex;

          return (
            <div
              key={slide._id || idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {isVideo ? (
                <video
                  src={slide.videoUrl || slide.mainImageUrl}
                  poster={slide.mainImageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover object-[75%_center] sm:object-[70%_center] lg:object-center select-none"
                />
              ) : (
                <img
                  src={slide.mainImageUrl}
                  alt={slide.title || 'Gharowa food'}
                  className="w-full h-full object-cover object-[75%_center] sm:object-[70%_center] lg:object-center select-none"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 2. SOFT DARK MAROON GRADIENT OVERLAY (Seamless text readability without any hard boundary) */}
      {/* Desktop / Laptop: Smooth horizontal gradient from left to right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#600710]/95 via-[#780914]/85 via-40% sm:via-45% to-transparent pointer-events-none z-1 hidden sm:block" />
      {/* Mobile: Full subtle darkening so text remains readable while food image shines through */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#600710]/90 via-[#780914]/80 to-[#600710]/85 pointer-events-none z-1 sm:hidden" />
      
      {/* Top and Bottom subtle blends for smooth transitions */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#600710]/80 via-[#780914]/30 to-transparent pointer-events-none z-1" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#600710]/80 to-transparent pointer-events-none z-1" />

      {/* Ambient micro pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-1" />

      {/* 3. HERO CONTENT (Left-Aligned Text, Badges, CTA Buttons & Trust Indicators) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-xl xl:max-w-2xl space-y-4 sm:space-y-5 text-center sm:text-left">
          {/* Authentic Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-[11px] sm:text-xs font-medium tracking-wider uppercase backdrop-blur-sm shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{displayBadge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-bold tracking-tight text-white leading-tight font-sans uppercase">
            {displayTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-[15px] text-white/90 font-normal max-w-lg leading-relaxed">
            {displaySubtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
            {/* Order Now Button */}
            <Link
              href={ctaLink}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-amber-50 text-[#900C19] font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 flex items-center gap-2 tracking-normal"
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
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-center sm:justify-start gap-5 sm:gap-7 text-xs text-white/90">
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
      </div>

      {/* 4. SLIDE INDICATORS / DOTS (Bottom Center/Right over Background Media) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center sm:justify-end sm:pr-12 md:pr-20 gap-1.5 z-20 pointer-events-auto">
          {slides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentSlideIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === currentSlideIndex
                  ? 'w-7 bg-amber-400 shadow-sm'
                  : 'w-1.5 bg-white/40 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
