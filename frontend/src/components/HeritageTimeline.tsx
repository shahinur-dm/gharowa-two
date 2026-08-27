'use client';

import React from 'react';
import { Sparkles, History, Award, Utensils, HeartHandshake, Compass } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

export default function HeritageTimeline() {
  const { language } = useLanguageStore();

  const timelineEvents = [
    {
      year: '1972',
      titleBn: 'প্রতিষ্ঠার শুরু ও স্বাধীনতার স্বাদ',
      titleEn: 'The Inception & Freedom Era',
      descBn: 'ঢাকার মতিঝিলে ঘরোয়া পরিবেশ ও ঐতিহ্যবাহী খাঁটি মসলায় শুরু হয় ঘরোয়া হোটেলের পথচলা।',
      descEn: 'Started in Motijheel Dhaka, crafting genuine home-style recipes with a secret spice blend.',
      icon: History,
      tag: 'Founding Year',
    },
    {
      year: '1980s',
      titleBn: 'মতিঝিলে পরিচিতি ও ভোজনরসিকদের আস্থা',
      titleEn: 'Iconic Motijheel Reputation',
      descBn: 'মতিঝিল বাণিজ্যিক এলাকার ব্যাংক, অফিস ও দূর-দূরান্ত থেকে আসা ভোজনপ্রেমীদের প্রিয় ঠাঁই হয়ে ওঠে।',
      descEn: 'Became the definitive lunch destination for Dhaka’s commercial hub and connoisseurs.',
      icon: Utensils,
      tag: 'The Craze Begins',
    },
    {
      year: '2000s',
      titleBn: 'অফিসপাড়া ও পরিবারের প্রিয় ঠিকানা',
      titleEn: 'Beloved Family & Corporate Choice',
      descBn: 'খাসির ভুনা খিচুড়ি ও স্পেশাল বোরহানির স্বাদ ছড়িয়ে পড়ে পুরো ঢাকা শহরে।',
      descEn: 'The legendary Mutton Bhuna Khichuri and Borhani earned iconic status across the nation.',
      icon: HeartHandshake,
      tag: 'Family Legacy',
    },
    {
      year: '2020s',
      titleBn: 'ঐতিহ্যের সঙ্গে আধুনিক সেবা',
      titleEn: 'Heritage Meets Modern Technology',
      descBn: 'মেট্রোরেল যোগাযোগ ও ডিজিটাল অর্ডারিং ও এক্সপ্রেস হোম ডেলিভারির সফল সংযোগ।',
      descEn: 'Integrated with Motijheel Metro connectivity, online ordering, and strict modern food safety.',
      icon: Compass,
      tag: 'Digital Evolution',
    },
    {
      year: '2026',
      titleBn: '৫০+ বছরের ঐতিহাসিক ঘরোয়া গৌরব',
      titleEn: '50+ Years of Glorious Heritage',
      descBn: 'অর্ধশতাব্দীর ঐতিহ্য ধরে রেখে আধুনিক কিচেন, লাইভ অর্ডারিং ও বিশ্বস্ত আতিথেয়তা।',
      descEn: 'Over half a century of culinary excellence, authentic taste, and unwavering customer trust.',
      icon: Award,
      tag: 'Golden Heritage',
    },
  ];

  return (
    <section className="py-20 bg-warm-50/60 border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-traditional-600" />
            <span>{language === 'bn' ? 'আমাদের গৌরবময় পথচলা' : 'Our Glorious Journey'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-bengali">
            {language === 'bn' ? '১৯৭২ থেকে ২০২৬: অর্ধশতাব্দীর ঐতিহ্যের গল্প' : '1972 to 2026: 50+ Years of Culinary Legacy'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-bengali leading-relaxed">
            {language === 'bn'
              ? 'মতিঝিলের প্রাণকেন্দ্রে প্রতিটি পদ রান্না হয় ঐতিহ্য, সততা ও খাঁটি দেশি স্বাদের অঙ্গীকারে।'
              : 'At the heart of Motijheel, every dish is cooked with love, heritage, and genuine Bangladeshi flavors.'}
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Central Line */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-0.5 bg-traditional-200" />

          <div className="space-y-8 lg:space-y-12">
            {timelineEvents.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.year}
                  className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-12 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full lg:w-1/2">
                    <div
                      className={`p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-traditional-300 transition-all duration-300 shadow-sm hover:shadow-card-hover ${
                        isEven ? 'lg:text-right' : 'lg:text-left'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 mb-2.5 ${
                          isEven ? 'lg:justify-end' : 'lg:justify-start'
                        }`}
                      >
                        <span className="text-[11px] font-bold text-traditional-800 bg-traditional-50 px-2.5 py-1 rounded-full border border-traditional-200">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 font-bengali">
                        {language === 'bn' ? item.titleBn : item.titleEn}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-bengali">
                        {language === 'bn' ? item.descBn : item.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Year Node */}
                  <div className="relative flex items-center justify-center shrink-0 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-traditional-700 to-amber-700 p-0.5 shadow-md">
                      <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center">
                        <Icon className="w-4 h-4 text-traditional-700 mb-0.5" />
                        <span className="text-[11px] font-bold font-mono text-slate-900">
                          {item.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Empty placeholder */}
                  <div className="hidden lg:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
