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
    <section className="py-20 bg-obsidian-500 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'আমাদের গৌরবময় পথচলা' : 'Our Glorious Journey'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-bengali">
            {language === 'bn' ? '১৯৭২ থেকে ২০২৬: অর্ধশতাব্দীর ঐতিহ্যের গল্প' : '1972 to 2026: 50+ Years of Culinary Legacy'}
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 font-bengali leading-relaxed">
            {language === 'bn'
              ? 'মতিঝিলের প্রাণকেন্দ্রে প্রতিটি পদ রান্না হয় ঐতিহ্য, সততা ও খাঁটি দেশি স্বাদের অঙ্গীকারে।'
              : 'At the heart of Motijheel, every dish is cooked with love, heritage, and genuine Bangladeshi flavors.'}
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Central Line for Desktop */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-gold-500/40 to-transparent" />

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
                      className={`p-6 sm:p-7 rounded-3xl bg-obsidian-400/90 border border-gold-500/20 hover:border-gold-500/45 transition-all duration-300 hover:shadow-gold ${
                        isEven ? 'lg:text-right' : 'lg:text-left'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 mb-3 ${
                          isEven ? 'lg:justify-end' : 'lg:justify-start'
                        }`}
                      >
                        <span className="text-[11px] font-bold text-gold-400 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white font-bengali">
                        {language === 'bn' ? item.titleBn : item.titleEn}
                      </h3>

                      <p className="text-xs text-gray-400 mt-2 leading-relaxed font-bengali">
                        {language === 'bn' ? item.descBn : item.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Year Node */}
                  <div className="relative flex items-center justify-center shrink-0 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-600 to-amber-900 p-0.5 shadow-gold animate-float">
                      <div className="w-full h-full bg-obsidian-500 rounded-[14px] flex flex-col items-center justify-center">
                        <Icon className="w-4 h-4 text-gold-400 mb-0.5" />
                        <span className="text-[11px] font-bold font-mono text-white">
                          {item.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Empty placeholder for Desktop balance */}
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
