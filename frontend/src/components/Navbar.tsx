'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Phone,
  MessageCircle,
  Menu as MenuIcon,
  X,
  Languages,
  Shield,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { toBanglaNumber } from '../lib/bangla';

export default function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguageStore();
  const { getItemCount, openCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', labelBn: 'হোম', labelEn: 'Home' },
    { href: '/menu', labelBn: 'মেনু ও অর্ডার', labelEn: 'Menu & Order' },
    { href: '/offers', labelBn: 'অফার', labelEn: 'Offers' },
    { href: '/about', labelBn: 'ঐতিহ্য', labelEn: 'About' },
    { href: '/gallery', labelBn: 'গ্যালারি', labelEn: 'Gallery' },
    { href: '/locations', labelBn: 'লোকেশন', labelEn: 'Location' },
    { href: '/contact', labelBn: 'টেবিল বুকিং', labelEn: 'Reservation' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-md'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Heritage Mark */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-traditional-700 via-traditional-600 to-amber-700 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <span className="text-xl font-bold text-traditional-700 font-serif">
                    GH
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-slate-900 tracking-wide font-bengali flex items-center gap-1.5">
                  ঘরোয়া রেস্টুরেন্ট
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-traditional-50 text-traditional-700 border border-traditional-200">
                    1972
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wider">
                  GHAROWA • MOTIJHEEL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-traditional-700 text-white shadow-sm'
                        : 'text-slate-700 hover:text-traditional-700 hover:bg-white'
                    }`}
                  >
                    {language === 'bn' ? link.labelBn : link.labelEn}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:border-traditional-300 hover:text-traditional-700 transition-all"
                title="ভাষা পরিবর্তন করুন / Switch Language"
              >
                <Languages className="w-3.5 h-3.5 text-traditional-600" />
                <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 hover:text-traditional-700 hover:border-traditional-300 transition-all"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-traditional-700 text-white font-bold text-xs flex items-center justify-center animate-bounce shadow-sm">
                    {language === 'bn' ? toBanglaNumber(itemCount) : itemCount}
                  </span>
                )}
              </button>

              {/* Direct WhatsApp Callout CTA */}
              <a
                href="https://wa.me/8801973255888"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>

              {/* Phone CTA */}
              <a
                href="tel:01973255888"
                className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-traditional-50 hover:bg-traditional-100 border border-traditional-200 text-traditional-800 text-xs font-bold transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-traditional-700" />
                <span>০১৯৭৩২৫৫৮৮৮</span>
              </a>

              {/* Admin Portal Link */}
              <Link
                href="/admin/login"
                className="hidden md:flex p-2 rounded-full text-slate-400 hover:text-traditional-700 hover:bg-slate-100 transition-all"
                title="Admin ERP / POS"
              >
                <Shield className="w-4 h-4" />
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-white/98 backdrop-blur-xl pt-24 px-6 pb-10 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm font-bold text-traditional-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-traditional-600" />
                ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (১৯৭২)
              </span>
              <span className="text-xs text-slate-500">মতিঝিল, ঢাকা</span>
            </div>

            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-xl text-base font-bold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-traditional-700 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-traditional-700'
                    }`}
                  >
                    <span>{language === 'bn' ? link.labelBn : link.labelEn}</span>
                    <span className="text-xs opacity-70">→</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-200 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:01973255888"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm"
              >
                <Phone className="w-4 h-4 text-traditional-700" />
                <span>কল করুন</span>
              </a>
              <a
                href="https://wa.me/8801973255888"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>

            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 hover:text-traditional-700 font-medium"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin ERP / POS Portal</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
