'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Clock, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
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
      titleBn: 'ঐতিহ্যের ৫০ বছর বিশেষ ছাড়',
      titleEn: 'Heritage 50 Years Celebration Discount',
      discount: '১০% ছাড় (10% Off)',
      minOrder: '৳৩০০',
      maxDiscount: '৳১০০',
      validTill: '৩১ ডিসেম্বর ২০২৬',
      descBn: 'যেকোনো খাসির ভুনা খিচুড়ি বা কাচ্চি অর্ডারে স্পেশাল প্রোমো কোড প্রয়োগ করে ইনস্ট্যান্ট ১০% মূল্যছাড় উপভোগ করুন।',
      descEn: 'Enjoy 10% instant discount on orders of Mutton Khichuri or Kacchi above ৳300.',
      isFeatured: true,
    },
    {
      code: 'MOTIJHEEL50',
      titleBn: 'মতিঝিল এক্সপ্রেস ফ্রি ডেলিভারি',
      titleEn: 'Motijheel Express Free Delivery',
      discount: 'ফ্রি ডেলিভারি',
      minOrder: '৳৫০০',
      maxDiscount: 'ডেলিভারি চার্জ মওকুফ',
      validTill: 'চলমান অফার',
      descBn: 'মতিঝিল, পল্টন, শান্তিনগর ও সংলগ্ন এলাকায় ৫০০ টাকার বেশি অর্ডারে সম্পূর্ণ ফ্রি হোম ডেলিভারি।',
      descEn: 'Enjoy zero delivery fees on orders above ৳500 across Motijheel, Paltan, and adjacent corporate areas.',
      isFeatured: false,
    },
    {
      code: 'CORPORATE15',
      titleBn: 'কর্পোরেট লাঞ্চ বক্স স্পেশাল',
      titleEn: 'Corporate Lunch Box Deal',
      discount: '১৫% ফ্ল্যাট ছাড়',
      minOrder: '৳২০০০',
      maxDiscount: '৳৫০০',
      validTill: 'অফিস সময়ের জন্য',
      descBn: 'ব্যাংক, বীমা ও করপোরেট অফিসের ১০+ ব্যক্তির লাঞ্চ বক্সে বিশেষ ১৫% ডিসকাউন্ট ভাউচার।',
      descEn: 'Special 15% discount for bulk corporate meal boxes for bank & financial institutions.',
      isFeatured: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs font-medium font-sans">
          <Gift className="w-3.5 h-3.5 text-traditional-600" />
          <span>{language === 'bn' ? 'চলমান প্রোমো কোড ও ডিসকাউন্ট' : 'Active Promo Vouchers'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-slate-900 font-sans tracking-tight">
          {language === 'bn' ? 'ঘরোয়ার স্পেশাল অফার ও কুপন' : 'Exclusive Gharowa Offers'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-bengali font-normal leading-relaxed">
          {language === 'bn'
            ? 'কুপন কোড কপি করে কার্টে প্রয়োগ করুন এবং মতিঝিলের ঐতিহাসিক স্বাদে উপভোগ করুন সেরা মূল্যছাড়।'
            : 'Copy any active promo coupon, paste into your cart drawer, and enjoy instant savings!'}
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.code}
            className={`p-6 sm:p-7 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between shadow-card hover:shadow-card-hover ${
              offer.isFeatured
                ? 'border-traditional-300 ring-2 ring-traditional-600/10'
                : 'border-slate-200 hover:border-traditional-200'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-traditional-800 bg-traditional-50 px-3 py-1 rounded-full border border-traditional-200 font-sans">
                  {offer.discount}
                </span>
                {offer.isFeatured && (
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-sans">
                    Bestseller
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 font-sans">
                  {language === 'bn' ? offer.titleBn : offer.titleEn}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-bengali font-normal">
                  {language === 'bn' ? offer.descBn : offer.descEn}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>ন্যূনতম অর্ডার:</span>
                  <strong className="text-slate-900">{offer.minOrder}</strong>
                </div>
                <div className="flex justify-between">
                  <span>সর্বোচ্চ ছাড়:</span>
                  <strong className="text-slate-900">{offer.maxDiscount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>মেয়াদ:</span>
                  <strong className="text-traditional-700">{offer.validTill}</strong>
                </div>
              </div>
            </div>

            {/* Copy Voucher Action */}
            <div className="pt-5 border-t border-slate-100 flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-dashed border-slate-300 font-mono font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>{offer.code}</span>
              </div>
              <button
                onClick={() => handleCopy(offer.code)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  copiedCode === offer.code
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-traditional-700 hover:bg-traditional-800 text-white shadow-sm'
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
                    <span>কপি কোড</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
