'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Languages,
  Menu as MenuIcon,
  X,
  ChevronRight,
} from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { toBanglaNumber } from '../lib/bangla';
import { api } from '../lib/api';
import GharowaLogo from './GharowaLogo';

export default function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguageStore();
  const { getItemCount, openCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');

  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res: any = await api.get('/settings');
        if (res.success && res.data) {
          setLogoUrl(res.data.logoUrl || '');
        }
      } catch (e) {
        // Fallback default
      }
    };
    fetchLogo();

    if (typeof window !== 'undefined') {
      window.addEventListener('gharowa_cms_updated', fetchLogo);
      return () => window.removeEventListener('gharowa_cms_updated', fetchLogo);
    }
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', labelBn: 'হোম', labelEn: 'Home' },
    { href: '/menu', labelBn: 'মেনু', labelEn: 'Menu' },
    { href: '/about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About Us' },
    { href: '/#chef', labelBn: 'শেফ', labelEn: 'Chef' },
    { href: '/#owner', labelBn: 'কর্ণধার', labelEn: 'Owner' },
    { href: '/contact', labelBn: 'যোগাযোগ', labelEn: 'Contact Us' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#800A15]/95 backdrop-blur-md shadow-lg py-2 border-b border-[#680811]'
            : 'bg-[#900C19] py-2.5 sm:py-3 border-b border-[#780a15]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Enhanced, Prominent Gharowa Logo & Brand Name */}
            <Link href="/" className="flex items-center gap-3 sm:gap-3.5 group">
              <GharowaLogo
                size={54}
                logoUrl={logoUrl}
                variant="header"
                className="group-hover:scale-105 transition-transform w-11 h-11 sm:w-[54px] sm:h-[54px]"
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-[21px] font-semibold text-white tracking-tight font-sans leading-tight">
                  Gharowa
                </span>
                <span className="text-[11px] sm:text-[12px] text-amber-200/90 font-normal tracking-wide font-bengali">
                  {language === 'bn' ? 'হোটেল এন্ড রেস্টুরেন্ট • ১৯৭২' : 'Hotel & Restaurant'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-[15px] font-medium tracking-[0.01em] transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm font-semibold'
                        : 'text-white/85 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {language === 'bn' ? link.labelBn : link.labelEn}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-white transition-all"
                title="ভাষা পরিবর্তন করুন / Switch Language"
              >
                <Languages className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all shadow-sm"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">
                  {language === 'bn' ? `কার্ট (${toBanglaNumber(itemCount)})` : `Cart (${itemCount})`}
                </span>
                {itemCount > 0 && (
                  <span className="sm:hidden w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-semibold text-[10px] flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle mobile navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#800A15] border-t border-[#700812] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <span>{language === 'bn' ? link.labelBn : link.labelEn}</span>
                  <ChevronRight className="w-4 h-4 text-amber-300/70" />
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium text-white"
              >
                <Languages className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'English Language' : 'বাংলা ভাষা'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
