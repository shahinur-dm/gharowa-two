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
            <div className="flex items-center gap-3.5">
              <GharowaLogo size={58} logoUrl={logoUrl} variant="header" />
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

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              {/* Facebook */}
              <a
                href={settings?.socialLinks?.facebook || 'https://facebook.com/gharowarestaurant'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gharowa Facebook Page"
                className="w-8.5 h-8.5 rounded-xl bg-white/10 hover:bg-[#1877F2] text-white/90 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={settings?.socialLinks?.instagram || 'https://instagram.com/gharowarestaurant'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gharowa Instagram"
                className="w-8.5 h-8.5 rounded-xl bg-white/10 hover:bg-[#E4405F] text-white/90 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={settings?.socialLinks?.youtube || 'https://youtube.com/@gharowarestaurant'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gharowa YouTube"
                className="w-8.5 h-8.5 rounded-xl bg-white/10 hover:bg-[#FF0000] text-white/90 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${(settings?.whatsappNumber || '01973255888').replace(/[^0-9]/g, '').replace(/^0/, '880')}?text=Hello%20Gharowa%20Restaurant`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gharowa WhatsApp"
                className="w-8.5 h-8.5 rounded-xl bg-white/10 hover:bg-[#25D366] text-white/90 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* Google Maps / Location */}
              <a
                href={settings?.googleMapsUrl || 'https://maps.google.com/?q=Gharowa+Restaurant+Motijheel+Dhaka'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gharowa Location on Google Maps"
                className="w-8.5 h-8.5 rounded-xl bg-white/10 hover:bg-[#EA4335] text-white/90 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent hover:scale-105"
              >
                <MapPin className="w-4 h-4 text-white" />
              </a>
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
