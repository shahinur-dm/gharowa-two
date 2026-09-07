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
import { api } from '../lib/api';
import { RestaurantSettings } from '../types';
import GharowaLogo from './GharowaLogo';

export default function Footer() {
  const { language } = useLanguageStore();
  const [settings, setSettings] = React.useState<RestaurantSettings | null>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res: any = await api.get('/settings');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchSettings();

    if (typeof window !== 'undefined') {
      window.addEventListener('gharowa_cms_updated', fetchSettings);
      return () => window.removeEventListener('gharowa_cms_updated', fetchSettings);
    }
  }, []);

  const logoUrl = settings?.logoUrl || '';
  const restaurantName = language === 'bn' ? (settings?.restaurantNameBn || 'Gharowa') : (settings?.restaurantNameEn || 'Gharowa');
  const tagline = language === 'bn' ? (settings?.taglineBn || 'হোটেল এন্ড রেস্টুরেন্ট • ১৯৭২') : (settings?.taglineEn || 'Hotel & Restaurant (Since 1972)');
  const footerDesc = language === 'bn'
    ? (settings?.footerDescriptionBn || '১৯৭২ সাল থেকে ঢাকার মতিঝিলের ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি, স্পেশাল কাচ্চি ও বোরহানি। ৫০+ বছরের বিশ্বস্ত স্বাদ।')
    : (settings?.footerDescriptionEn || '50+ Years of Authentic Culinary Heritage in Motijheel, Dhaka. Famous for our Mutton Bhuna Khichuri & Kacchi.');
  const address = language === 'bn'
    ? (settings?.addressBn || '৯/সি মতিঝিল বা/এ, ঢাকা-১০০০ (মেট্রোরেল স্টেশন সংলগ্ন)')
    : (settings?.addressEn || '9/C Motijheel C/A, Dhaka-1000 (Near Metro Station)');
  const phone = settings?.phone || '01973255888';
  const email = settings?.email || 'info@gharowarestaurant.com';
  const hours = language === 'bn'
    ? (settings?.openingHoursBn || 'সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)')
    : (settings?.openingHoursEn || '7:00 AM - 11:30 PM (Everyday)');
  const copyright = language === 'bn'
    ? (settings?.copyrightTextBn || '© ১৯৭২-২০২৬ ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট। সর্বস্বত্ব সংরক্ষিত।')
    : (settings?.copyrightTextBn || '© 1972 - 2026 Gharowa Hotel & Restaurant. All Rights Reserved.');

  return (
    <footer className="relative bg-[#55060D] text-white/80 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* 1. Brand Logo & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <GharowaLogo size={46} logoUrl={logoUrl} variant="header" />
              <div>
                <h3 className="text-base font-semibold text-white font-sans">
                  {restaurantName}
                </h3>
                <p className="text-[11px] text-amber-300 font-medium font-sans">
                  {tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-white/75 leading-relaxed font-normal font-bengali">
              {footerDesc}
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit font-sans font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? '১০০% হালাল ও স্বাস্থ্যসম্মত' : '100% Halal & Fresh Ingredients'}</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-sans">
              {language === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs text-white/80 font-normal">
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
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-sans">
              {language === 'bn' ? 'মেনু ক্যাটাগরি' : 'Our Menu'}
            </h4>
            <ul className="space-y-2 text-xs text-white/80 font-normal">
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
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-sans">
              {language === 'bn' ? 'যোগাযোগের ঠিকানা' : 'Contact Info'}
            </h4>
            <div className="space-y-2.5 text-xs text-white/80 font-normal">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-bengali">{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-amber-300 font-medium font-mono">{phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bengali">{hours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>{copyright}</p>
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
