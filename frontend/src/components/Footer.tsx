'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Mail,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import GharowaLogo from './GharowaLogo';

export default function Footer() {
  const { language } = useLanguageStore();

  return (
    <footer className="relative bg-[#55060D] text-white/80 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* 1. Brand Logo & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <GharowaLogo size={46} variant="header" />
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  Gharowa
                </h3>
                <p className="text-[11px] text-amber-300 font-semibold font-mono">
                  Hotel & Restaurant (Since 1972)
                </p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-light font-bengali">
              {language === 'bn'
                ? '১৯৭২ সাল থেকে ঢাকার মতিঝিলের ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি, স্পেশাল কাচ্চি ও বোরহানি। ৫০+ বছরের বিশ্বস্ত স্বাদ।'
                : '50+ Years of Authentic Culinary Heritage in Motijheel, Dhaka. Famous for our Mutton Bhuna Khichuri & Kacchi.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? '১০০% হালাল ও স্বাস্থ্যসম্মত' : '100% Halal & Fresh Ingredients'}</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase font-serif">
              {language === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  {language === 'bn' ? 'হোম' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  {language === 'bn' ? 'মেনু' : 'Menu'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/#chef" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  {language === 'bn' ? 'শেফ' : 'Chef'}
                </Link>
              </li>
              <li>
                <Link href="/#owner" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  {language === 'bn' ? 'কর্ণধার' : 'Owner'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  {language === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Our Menu Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase font-serif">
              {language === 'bn' ? 'মেনু ক্যাটাগরি' : 'Our Menu'}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/menu" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Khichuri (খিচুড়ি)
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Biryani (বিরিয়ানি ও তেহারি)
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Mutton & Beef (খাসি ও বিফ)
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Borhani & Drinks (পানীয়)
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Desserts (ফিরনি ও জর্দা)
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase font-serif">
              {language === 'bn' ? 'যোগাযোগের ঠিকানা' : 'Contact Info'}
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>৯/সি মতিঝিল বা/এ, ঢাকা-১০০০ (মেট্রোরেল স্টেশন সংলগ্ন)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:01973255888" className="hover:text-amber-300 font-bold">+880 1973-255888</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@gharowarestaurant.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 1972 - 2026 Gharowa Hotel & Restaurant. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-amber-300 text-white/60 transition-colors">
              Admin ERP & POS Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
