'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { RestaurantSettings } from '../types';
import { useLanguageStore } from '../store/languageStore';

interface AboutStoryProps {
  settings?: RestaurantSettings | null;
}

export default function AboutStorySection({ settings }: AboutStoryProps) {
  const { language } = useLanguageStore();

  const title =
    language === 'bn'
      ? settings?.aboutTitleBn || 'আমাদের ঐতিহ্য ও গল্প'
      : settings?.aboutTitleEn || 'Our Heritage Story';

  const description =
    language === 'bn'
      ? settings?.aboutDescBn ||
        '১৯৭২ সালে মতিঝিলের প্রাণকেন্দ্রে শুরু হয় ঘরোয়া হোটেল এন্ড রেস্টুরেন্টের ঐতিহাসিক যাত্রা। বিগত ৫ দশকেরও বেশি সময় ধরে আমরা ধরে রেখেছি খাঁটি ঢাকাইয়া রান্নার অতুলনীয় ঐতিহ্য ও স্বাদ।'
      : settings?.aboutDescEn ||
        'Gharowa Hotel & Restaurant started in 1972 with a simple goal — to serve authentic Bangladeshi flavors with the highest quality and love. Our Mutton Khichuri is our signature dish celebrated by generations.';

  const aboutImage =
    settings?.aboutImageUrl ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop';

  const stats = settings?.aboutStats && settings.aboutStats.length > 0
    ? settings.aboutStats
    : [
        { labelBn: 'বছরের ঐতিহ্য', labelEn: 'Years Heritage', value: '50+' },
        { labelBn: 'সন্তুষ্ট ভোজনরসিক', labelEn: 'Happy Customers', value: '100K+' },
        { labelBn: 'খাঁটি উপাদান', labelEn: 'Fresh Ingredients', value: '100%' },
        { labelBn: 'গ্রাহক রেটিং', labelEn: 'Customer Rating', value: '4.9 ★' },
      ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Main Red Card Box */}
      <div className="bg-[#800A15] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-6 sm:p-10 lg:p-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-[11px] font-medium tracking-wider text-amber-300 uppercase font-sans">
              {language === 'bn' ? 'আমাদের পরিচিতি' : 'ABOUT US'}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-semibold font-sans tracking-tight leading-snug text-white">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal font-bengali">
              {description}
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#900C19] font-semibold text-xs sm:text-sm shadow-md hover:bg-amber-50 transition-all tracking-normal"
              >
                <span>{language === 'bn' ? 'আমাদের ইতিহাস জানুন' : 'Learn More About Us'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
              <Image
                src={aboutImage}
                alt="Gharowa Hotel & Restaurant Dining"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Stats Counter Bar */}
        <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-semibold text-amber-300 font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-white/80 font-normal font-bengali">
                {language === 'bn' ? stat.labelBn : stat.labelEn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
