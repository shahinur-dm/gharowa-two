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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', labelBn: 'হোম', labelEn: 'Home' },
    { href: '/menu', labelBn: 'মেনু', labelEn: 'Menu' },
    { href: '/offers', labelBn: 'অফার', labelEn: 'Offers' },
    { href: '/about', labelBn: 'ঐতিহ্য', labelEn: 'About' },
    { href: '/gallery', labelBn: 'গ্যালারি', labelEn: 'Gallery' },
    { href: '/locations', labelBn: 'লোকেশন', labelEn: 'Location' },
    { href: '/contact', labelBn: 'যোগাযোগ ও বুকিং', labelEn: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-obsidian-500/90 backdrop-blur-xl border-b border-gold-500/20 py-3 shadow-dark'
            : 'bg-gradient-to-b from-obsidian-500/90 via-obsidian-500/40 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Heritage Mark */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 via-gold-600 to-amber-900 p-0.5 shadow-gold group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-obsidian-500 rounded-[10px] flex items-center justify-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-gold-300 to-amber-500 bg-clip-text text-transparent font-serif">
                    GH
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-white tracking-wide font-bengali flex items-center gap-1.5">
                  ঘরোয়া রেস্টুরেন্ট
                  <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                    1972
                  </span>
                </span>
                <span className="text-[11px] text-gray-400 font-medium tracking-wider">
                  GHAROWA • MOTIJHEEL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-obsidian-400/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/15">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gold-500 text-obsidian-900 font-semibold shadow-gold'
                        : 'text-gray-300 hover:text-gold-400 hover:bg-white/5'
                    }`}
                  >
                    {language === 'bn' ? link.labelBn : link.labelEn}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons & CTAs */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-obsidian-400/90 border border-gold-500/20 text-xs font-semibold text-gold-300 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all"
                title="ভাষা পরিবর্তন করুন / Switch Language"
              >
                <Languages className="w-3.5 h-3.5 text-gold-400" />
                <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full bg-obsidian-400/90 border border-gold-500/25 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/60 transition-all shadow-inner-gold"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center justify-center animate-bounce shadow-gold">
                    {language === 'bn' ? toBanglaNumber(itemCount) : itemCount}
                  </span>
                )}
              </button>

              {/* Direct WhatsApp Callout CTA */}
              <a
                href="https://wa.me/8801973255888"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md hover:shadow-emerald-500/30 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>

              {/* Phone CTA */}
              <a
                href="tel:01973255888"
                className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-semibold transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>০১৯৭৩২৫৫৮৮৮</span>
              </a>

              {/* Admin Portal Link */}
              <Link
                href="/admin/login"
                className="hidden md:flex p-2 rounded-full text-gray-400 hover:text-gold-400 hover:bg-white/5 transition-all"
                title="Admin ERP / POS"
              >
                <Shield className="w-4 h-4" />
              </Link>

              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-obsidian-400 border border-gold-500/20 text-gray-300 hover:text-white"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-obsidian-900/95 backdrop-blur-2xl pt-24 px-6 pb-10 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gold-500/20 flex items-center justify-between">
              <span className="text-sm font-semibold text-gold-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (১৯৭২)
              </span>
              <span className="text-xs text-gray-400">মতিঝিল, ঢাকা</span>
            </div>

            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold'
                        : 'text-gray-200 hover:bg-obsidian-300 hover:text-gold-400'
                    }`}
                  >
                    <span>{language === 'bn' ? link.labelBn : link.labelEn}</span>
                    <span className="text-xs opacity-70">→</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-gold-500/20 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:01973255888"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-obsidian-300 border border-gold-500/30 text-gold-300 font-semibold text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>কল করুন</span>
              </a>
              <a
                href="https://wa.me/8801973255888"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>

            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-obsidian-400/80 border border-gray-800 text-xs text-gray-400 hover:text-gold-400"
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
