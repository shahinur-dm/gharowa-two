'use client';

import React from 'react';
import { Flame, UtensilsCrossed, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

export default function SignatureCards() {
  const { language } = useLanguageStore();

  const cards = [
    {
      icon: Flame,
      titleBn: 'ঐতিহ্যের গোপন মসলা',
      titleEn: '1972 Secret Heritage Blend',
      descBn: '১৯৭২ সাল থেকে চলে আসা খাঁটি নিজস্ব মসলা বাটার স্বাদ, যা অন্য কোথাও মেলে না।',
      descEn: 'Our proprietary slow-toasted spice blend perfected over 50 years of culinary mastery.',
      badge: 'Heritage Secret',
    },
    {
      icon: UtensilsCrossed,
      titleBn: 'লাইভ কিচেন প্রিপারেশন',
      titleEn: 'Live Kitchen Preparation',
      descBn: 'অর্ডার অনুযায়ী খাঁটি দেশি ঘিয়ে গরম গরম ভুনা ও তাজা দম কাচ্চির পরিবেশন।',
      descEn: 'Freshly prepared upon your order in pure country ghee and authentic steam dum pots.',
      badge: 'Fresh & Hot',
    },
    {
      icon: ShieldCheck,
      titleBn: '১০০% পরিচ্ছন্ন ও নিরাপদ',
      titleEn: 'Hygienic & Food Safe',
      descBn: 'আধুনিক স্বাস্থ্যবিধি মেনে প্রতিটি আইটেমের গুণগত মান শতভাগ নিশ্চিত করা হয়।',
      descEn: 'Uncompromising hygiene standards, premium ingredients, and 100% Halal certified meats.',
      badge: 'Strict Hygiene',
    },
  ];

  return (
    <section className="py-16 bg-obsidian-600/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative p-7 rounded-3xl bg-obsidian-400 border border-gold-500/15 hover:border-gold-500/50 transition-all duration-300 hover:shadow-gold hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full pointer-events-none group-hover:bg-gold-500/10 transition-colors" />

                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition-all shadow-inner-gold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-bengali group-hover:text-gold-300 transition-colors">
                  {language === 'bn' ? card.titleBn : card.titleEn}
                </h3>

                <p className="text-xs text-gray-400 mt-2.5 leading-relaxed font-bengali">
                  {language === 'bn' ? card.descBn : card.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
