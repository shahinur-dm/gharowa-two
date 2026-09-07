'use client';

import React from 'react';
import { ShieldCheck, HeartHandshake, Truck, Award, Sparkles } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

export default function WhyChooseUs() {
  const { language } = useLanguageStore();

  const features = [
    {
      icon: ShieldCheck,
      titleBn: 'তাজা উপাদান',
      titleEn: 'Fresh Ingredients',
      descBn: 'আমরা কেবল সেরা ও সবচেয়ে তাজা খাসি ও মসলা ব্যবহার করি।',
      descEn: 'We use only the finest and freshest ingredients.',
    },
    {
      icon: HeartHandshake,
      titleBn: 'আসল ঐতিহ্যবাহী স্বাদ',
      titleEn: 'Authentic Taste',
      descBn: '১৯৭২ সালের গোপন খাঁটি ঘরোয়া রেসিপিতে ভালোবাসা দিয়ে রান্না।',
      descEn: 'Traditional recipes cooked with love and perfection.',
    },
    {
      icon: Truck,
      titleBn: 'দ্রুত ডেলিভারি',
      titleEn: 'Fast Delivery',
      descBn: 'আপনার প্রিয় গরম খাবার দ্রুততম সময়ে পৌঁছানো হয়।',
      descEn: 'Your favorite food delivered hot & fresh to your door.',
    },
    {
      icon: Award,
      titleBn: 'মানসম্মত সেবা',
      titleEn: 'Quality Service',
      descBn: 'গ্রাহকদের শতভাগ সন্তুষ্টি আমাদের শীর্ষ অগ্রাধিকার।',
      descEn: 'Customer satisfaction is our top priority.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-slate-200/70">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-[11px] font-medium tracking-wider text-[#900C19] uppercase mb-1 font-sans">
          {language === 'bn' ? 'আমাদের বিশেষত্ব' : 'WHY CHOOSE US'}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-slate-900 font-sans tracking-tight">
          {language === 'bn' ? 'মানুষ কেন আমাদের ভালোবাসে' : 'Why People Love Us'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-red-200 shadow-sm hover:shadow-card-hover transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#900C19] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#900C19] group-hover:text-white transition-all shadow-sm">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5 font-sans">
                {language === 'bn' ? f.titleBn : f.titleEn}
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed font-bengali">
                {language === 'bn' ? f.descBn : f.descEn}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
