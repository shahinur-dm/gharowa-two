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

// Dynamically import 3D Hero Canvas for optimal bundle loading
const SignatureDishCanvas = dynamic(
  () => import('../components/SignatureDishCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] md:h-[480px] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
      </div>
    ),
  }
);

export default function HomePage() {
  const { language } = useLanguageStore();
  const { openCart, addItem } = useCartStore();
  const [topDishes, setTopDishes] = useState<MenuItem[]>([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState(true);

  useEffect(() => {
    const fetchTopDishes = async () => {
      try {
        const res: any = await api.get('/menu/items');
        if (res.success && res.data) {
          setTopDishes(res.data.slice(0, 8));
        }
      } catch (e) {
        console.warn('Could not fetch top dishes', e);
      } finally {
        setIsLoadingDishes(false);
      }
    };
    fetchTopDishes();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. CINEMATIC HERO SECTION WITH 3D KHICHURI PRESENTATION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
        {/* Background ambient lighting */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Heritage Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-gold animate-fadeIn">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>৫০+ বছরের ঐতিহ্যবাহী স্বাদ • Since 1972</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-bengali leading-tight tracking-tight">
                ১৯৭২ থেকে ঢাকার হৃদয়ে{' '}
                <span className="gold-gradient-text">ঐতিহ্যের স্বাদ</span>
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-bengali max-w-2xl leading-relaxed">
                {language === 'bn'
                  ? '৫০+ বছরের ঐতিহ্যবাহী ঘরোয়া স্বাদ, এখন আরও আধুনিক অভিজ্ঞতায়। মতিঝিল মেট্রোরেল ও শাপলা চত্বরের প্রাণকেন্দ্রে ঢাকার সবচেয়ে প্রিয় খাসির ভুনা খিচুড়ি ও স্পেশাল কাচ্চি।'
                  : 'Over 50 years of authentic Bangladeshi culinary heritage in Motijheel Dhaka. Renowned for Dhaka’s most celebrated Mutton Bhuna Khichuri and Dum Kacchi.'}
              </p>

              {/* Landmark Callout */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-300 pt-2">
                <span className="flex items-center gap-1.5 bg-obsidian-400 px-3.5 py-1.5 rounded-full border border-gold-500/20">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  ৯/সি মতিঝিল বা/এ (মেট্রোরেল সংলগ্ন)
                </span>
                <span className="flex items-center gap-1.5 bg-obsidian-400 px-3.5 py-1.5 rounded-full border border-gold-500/20">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  সকাল ৭:০০ - রাত ১১:৩০
                </span>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4">
                {/* Order Now (Cart Trigger) */}
                <button
                  onClick={openCart}
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-extrabold text-sm flex items-center gap-2.5 shadow-gold hover:shadow-gold-lg transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
                </button>

                {/* Instant WhatsApp Order Button */}
                <a
                  href="https://wa.me/8801973255888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp-এ অর্ডার করুন</span>
                </a>

                {/* View Location */}
                <Link
                  href="/locations"
                  className="px-5 py-3.5 rounded-full bg-obsidian-400 hover:bg-obsidian-300 border border-gold-500/20 text-gray-300 hover:text-white text-xs sm:text-sm font-semibold transition-all"
                >
                  {language === 'bn' ? 'লোকেশন দেখুন' : 'View Location'}
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

      {/* 3. TOP SIGNATURE DISHES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20 mb-2">
              <Flame className="w-3.5 h-3.5 text-gold-500" />
              <span>ঐতিহ্যের সেরা পদসমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-bengali">
              {language === 'bn' ? 'জনপ্রিয় সেরা খাবার' : 'Our Bestseller Dishes'}
            </h2>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian-400 hover:bg-obsidian-300 border border-gold-500/25 text-gold-300 hover:text-gold-200 text-xs font-semibold transition-all shadow-inner-gold"
          >
            <span>{language === 'bn' ? 'পুরো মেনু দেখুন' : 'Explore Full Menu'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoadingDishes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-80 rounded-2xl bg-obsidian-400/50 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDishes.map((dish) => (
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>অভিজাত আতিথেয়তা ও ক্যাটারিং</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-bengali leading-tight">
              পরিবার বা অফিসের বিশেষ আয়োজনে{' '}
              <span className="gold-gradient-text">ঘরোয়া ঐতিহ্যে আসুন</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-bengali">
              মতিঝিলের শীতাতপ নিয়ন্ত্রিত ভিআইপি ও ফ্যামিলি জোনে নিরিবিলি পরিবেশ। কর্পোরেট মিটিং, ফ্যামিলি গেট-টুগেদার বা বিবাহোত্তর ভোজের জন্য বিশেষ রিজার্ভেশন সুবিধা।
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold-500/15">
                <span className="text-xl font-bold text-gold-400 font-mono">100+</span>
                <p className="text-gray-400 mt-1">আসন বিশিষ্ট প্রশস্ত ডাইনিং হল</p>
              </div>
              <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold-500/15">
                <span className="text-xl font-bold text-gold-400 font-mono">100%</span>
                <p className="text-gray-400 mt-1">খাঁটি গাওয়া ঘি ও ফ্রেশ খাসি</p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/8801973255888?text=%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%95%E0%A6%B0%E0%A7%8D%E0%A6%AA%E0%A7%8B%E0%A6%B0%E0%A7%87%E0%A6%9F%20%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%9F%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A6%82%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>কর্পোরেট ক্যাটারিং এর জন্য WhatsApp-এ কথা বলুন →</span>
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
