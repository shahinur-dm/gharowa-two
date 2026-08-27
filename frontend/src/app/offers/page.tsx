'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Clock, Percent, Gift, ShoppingBag } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { useCartStore } from '../../store/cartStore';

export default function OffersPage() {
  const { language } = useLanguageStore();
  const { openCart } = useCartStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const offers = [
    {
      code: 'GH1972',
      titleBn: '১৯৭২ ঐতিহ্য সেলিব্রেশন ১০% ছাড়',
      titleEn: '1972 Heritage Celebration 10% OFF',
      descBn: 'যেকোনো অনলাইন বা WhatsApp অর্ডারে সরাসরি ১০% ডিসকাউন্ট (সর্বোচ্চ ১০০ টাকা পর্যন্ত)।',
      descEn: 'Enjoy 10% off on all online orders up to ৳100.',
      type: '10% OFF',
      minOrder: '৳৩০০',
      tag: 'Most Popular',
    },
    {
      code: 'MOTIJHEEL50',
      titleBn: 'মতিঝিল কর্পোরেট ফ্ল্যাট ৫০ টাকা ছাড়',
      titleEn: 'Motijheel Corporate Flat ৳50 OFF',
      descBn: 'অফিস বা পরিবারের জন্য ৫০০ টাকার যেকোনো অর্ডারে ফ্ল্যাট ৫০ টাকা ছাড়।',
      descEn: 'Get flat ৳50 discount on all orders above ৳500.',
      type: '৳50 OFF',
      minOrder: '৳৫০০',
      tag: 'Corporate Special',
    },
    {
      code: 'FAMILYFEAST',
      titleBn: 'ফ্যামিলি ভোজ প্যাকেজ ১৫% ছাড়',
      titleEn: 'Family Feast Combo 15% OFF',
      descBn: 'খাসির ভুনা খিচুড়ি + কাচ্চি + বোরহানি কম্বো অর্ডারে বিশেষ ১৫% ছাড়।',
      descEn: '15% off when you order 4 or more signature platters.',
      type: '15% OFF',
      minOrder: '৳১০০০',
      tag: 'Weekend Special',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <Gift className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'স্পেশাল ডিসকাউন্ট ও ভাউচার' : 'Deals & Promo Coupons'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-bengali">
          {language === 'bn' ? 'আকর্ষণীয় অফার ও কুপন' : 'Exclusive Offers & Promo Codes'}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 font-bengali leading-relaxed">
          {language === 'bn'
            ? 'কুপন কোড কপি করে কার্টে প্রয়োগ করুন অথবা WhatsApp অর্ডারে বার্তা পাঠান।'
            : 'Copy coupon code and apply at cart drawer or mention in WhatsApp order.'}
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, idx) => (
          <div
            key={idx}
            className="group relative p-6 sm:p-7 rounded-3xl bg-obsidian-400 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300 hover:shadow-gold flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/30">
                  {offer.tag}
                </span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {offer.type}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-bengali group-hover:text-gold-300 transition-colors">
                {language === 'bn' ? offer.titleBn : offer.titleEn}
              </h3>

              <p className="text-xs text-gray-400 mt-2 leading-relaxed font-bengali">
                {language === 'bn' ? offer.descBn : offer.descEn}
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3 mt-4">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>ন্যূনতম অর্ডার:</span>
                <span className="font-bold text-white">{offer.minOrder}</span>
              </div>

              {/* Coupon Copy Box */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-obsidian-300 border border-dashed border-gold-500/30">
                <span className="font-mono font-bold text-gold-400 tracking-wider text-sm pl-2">
                  {offer.code}
                </span>
                <button
                  onClick={() => handleCopy(offer.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    copiedCode === offer.code
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gold-500 hover:bg-gold-400 text-obsidian-950'
                  }`}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Corporate Lunch Box Combo Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-obsidian-400 via-obsidian-400 to-obsidian-300 border border-gold-500/25 shadow-gold-lg flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>মতিঝিল কর্পোরেট ক্যাটারিং পার্টনার</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-bengali">
            অফিস লাঞ্চ বা কনফারেন্সে স্পেশাল কম্বো অফার
          </h2>
          <p className="text-xs text-gray-400 max-w-xl">
            ব্যাংক, মাল্টিন্যাশনাল অফিস ও কর্পোরেট ইভেন্টে গরম গরম খাসির ভুনা খিচুড়ি ও বোরহানি ডেলিভারির জন্য বিশেষ রেট প্রযোজ্য।
          </p>
        </div>

        <button
          onClick={openCart}
          className="px-8 py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs sm:text-sm whitespace-nowrap shadow-gold flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>এখনই অর্ডার করুন</span>
        </button>
      </div>
    </div>
  );
}
