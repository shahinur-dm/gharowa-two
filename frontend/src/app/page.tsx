'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Clock,
  ArrowRight,
  Flame,
  Award,
  ShieldCheck,
  Star,
  Phone,
  ChevronRight,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { MenuItem } from '../types';
import { api } from '../lib/api';
import DishCard from '../components/DishCard';
import SignatureCards from '../components/SignatureCards';
import HeritageTimeline from '../components/HeritageTimeline';
import ReservationForm from '../components/ReservationForm';
import { toBanglaNumber, formatPrice } from '../lib/bangla';

const SignatureDishCanvas = dynamic(
  () => import('../components/SignatureDishCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] md:h-[480px] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-traditional-600/20 border-t-traditional-600 animate-spin" />
      </div>
    ),
  }
);

export default function HomePage() {
  const { language } = useLanguageStore();
  const { openCart } = useCartStore();
  const [topDishes, setTopDishes] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoadingDishes, setIsLoadingDishes] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res: any = await api.get('/menu/items');
        if (res.success && res.data) {
          setTopDishes(res.data);
        }
      } catch (e) {
        console.warn('Dishes fetch error', e);
      } finally {
        setIsLoadingDishes(false);
      }
    };
    fetchDishes();
  }, []);

  const displayedDishes =
    selectedCategory === 'all'
      ? topDishes
      : topDishes.filter((d) => {
          const slug = typeof d.category === 'object' && d.category ? d.category.slug : d.category;
          return slug === selectedCategory;
        });

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-warm-50 via-white to-warm-50/50 pt-8 pb-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Heritage Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-traditional-600" />
                <span>৫০+ বছরের ঐতিহ্যবাহী স্বাদ • Established 1972</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-bengali leading-tight tracking-tight">
                ১৯৭২ থেকে ঢাকার হৃদয়ে{' '}
                <span className="text-traditional-700">ঐতিহ্যের স্বাদ</span>
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-bengali max-w-2xl leading-relaxed">
                {language === 'bn'
                  ? '৫০+ বছরের ঐতিহ্যবাহী ঘরোয়া স্বাদ, এখন আরও আধুনিক অভিজ্ঞতায়। মতিঝিল মেট্রোরেল ও শাপলা চত্বরের সংলগ্ন ঢাকার সবচেয়ে প্রিয় খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি ও স্পেশাল কাচ্চি।'
                  : 'Over 50 years of authentic Bangladeshi culinary heritage in Motijheel Dhaka. Celebrated for our iconic Mutton Bhuna Khichuri, Mutton Shank, and Dum Kacchi.'}
              </p>

              {/* Landmark Callouts */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-700 pt-1">
                <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 text-traditional-700" />
                  ৯/সি মতিঝিল বা/এ (মেট্রোরেল স্টেশন সংলগ্ন)
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium">
                  <Clock className="w-3.5 h-3.5 text-traditional-700" />
                  সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)
                </span>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4">
                {/* Order Now (Cart Trigger) */}
                <button
                  onClick={openCart}
                  className="px-7 py-3.5 rounded-full bg-traditional-700 hover:bg-traditional-800 text-white font-bold text-sm flex items-center gap-2.5 shadow-red hover:shadow-red-lg transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
                </button>

                {/* Instant WhatsApp Order Button */}
                <a
                  href="https://wa.me/8801973255888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2.5 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp-এ অর্ডার করুন</span>
                </a>

                {/* View Menu */}
                <Link
                  href="/menu"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  {language === 'bn' ? 'মেনু তালিকা' : 'View Menu'}
                </Link>
              </div>
            </div>

            {/* Right 3D Interactive Platter Presentation */}
            <div className="lg:col-span-5 relative">
              <SignatureDishCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE HIGHLIGHT CARDS */}
      <SignatureCards />

      {/* 3. PROFESSIONALLY ARRANGED MENU & ORDER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-traditional-700 bg-traditional-50 px-3.5 py-1 rounded-full border border-traditional-200 mb-2">
              <Utensils className="w-3.5 h-3.5 text-traditional-600" />
              <span>ঐতিহ্যের সেরা খাবার মেনু</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-bengali">
              {language === 'bn' ? 'পছন্দের খাবার অর্ডার করুন' : 'Popular Dishes & Instant Order'}
            </h2>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-traditional-700 font-bold text-xs shadow-sm transition-all"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ মেনু দেখুন' : 'Explore Full Menu'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {[
            { id: 'all', bn: 'সব খাবার', en: 'All' },
            { id: 'lunch-dinner', bn: 'দুপুর ও রাত', en: 'Lunch & Dinner' },
            { id: 'breakfast', bn: 'সকালের নাস্তা', en: 'Breakfast' },
            { id: 'fish', bn: 'মাছ স্পেশাল', en: 'Fish Special' },
            { id: 'kebab', bn: 'কাবাব ও গ্রিল', en: 'Kebab' },
            { id: 'beverages', bn: 'পানীয় ও বোরহানি', en: 'Beverages' },
            { id: 'dessert', bn: 'ডেজার্ট ও ফিরনি', en: 'Dessert' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-traditional-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:text-traditional-700 border border-slate-200'
              }`}
            >
              {language === 'bn' ? cat.bn : cat.en}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        {isLoadingDishes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-80 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedDishes.slice(0, 8).map((dish) => (
              <DishCard key={dish._id} dish={dish} />
            ))}
          </div>
        )}
      </section>

      {/* 4. HERITAGE TIMELINE (1972 - 2026) */}
      <HeritageTimeline />

      {/* 5. TABLE RESERVATION & CATERING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-traditional-600" />
              <span>অভিজাত ডাইনিং ও কর্পোরেট ক্যাটারিং</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-bengali leading-tight">
              পরিবার বা অফিসের বিশেষ আয়োজনে{' '}
              <span className="text-traditional-700">ঘরোয়া ঐতিহ্যে আসুন</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bengali">
              মতিঝিলের প্রশস্ত শীতাতপ নিয়ন্ত্রিত ভিআইপি ও ফ্যামিলি জোনে আরামদায়ক নিরিবিলি পরিবেশ। কর্পোরেট মিটিং, ফ্যামিলি গেট-টুগেদার বা যেকোনো পারিবারিক ভোজের জন্য বিশেষ টেবিল রিজার্ভেশন সুবিধা।
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xl font-bold text-traditional-700 font-mono">100+</span>
                <p className="text-slate-600 mt-1 font-medium">আসন বিশিষ্ট প্রশস্ত ডাইনিং হল</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xl font-bold text-traditional-700 font-mono">100%</span>
                <p className="text-slate-600 mt-1 font-medium">খাঁটি গাওয়া ঘি ও ফ্রেশ খাসি</p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/8801973255888"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>কর্পোরেট ক্যাটারিং এর জন্য WhatsApp-এ যোগাযোগ করুন →</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ReservationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
