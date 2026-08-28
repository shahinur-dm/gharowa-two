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
  ChevronRight,
} from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { toBanglaNumber } from '../lib/bangla';
import GharowaLogo from './GharowaLogo';

export default function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguageStore();
  const { getItemCount, openCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
            ? 'bg-[#800A15] shadow-lg py-2.5 border-b border-white/10'
            : 'bg-[#900C19] py-3.5 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Exact Gharowa Logo & Brand Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <GharowaLogo size={42} variant="header" className="group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold text-white tracking-wide font-serif leading-tight">
                  Gharowa
                </span>
                <span className="text-[10px] text-amber-200/90 font-medium tracking-wider font-bengali">
                  {language === 'bn' ? 'হোটেল এন্ড রেস্টুরেন্ট • ১৯৭২' : 'Hotel & Restaurant'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm'
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
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-bold text-white transition-all"
                title="ভাষা পরিবর্তন করুন / Switch Language"
              >
                <Languages className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-sm"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">
                  {language === 'bn' ? `কার্ট (${toBanglaNumber(itemCount)})` : `Cart (${itemCount})`}
                </span>
                {itemCount > 0 && (
                  <span className="sm:hidden w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Prominent "Order Now" Button */}
              <Link
                href="/menu"
                className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-[#900C19] font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
              </Link>

              {/* Admin Portal link */}
              <Link
                href="/admin/login"
                className="hidden md:flex p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
                title="Admin Portal"
              >
                <Shield className="w-4 h-4" />
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-[#800A15] text-white p-6 pt-20 flex flex-col justify-between shadow-2xl border-l border-white/15 overflow-y-auto">
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GharowaLogo size={36} variant="header" />
                  <div>
                    <h3 className="font-serif font-bold text-sm text-white">Gharowa</h3>
                    <p className="text-[10px] text-amber-300">Hotel & Restaurant</p>
                  </div>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-bold text-white border border-white/20"
                >
                  <Languages className="w-3 h-3 text-amber-300" />
                  <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-white/25 text-white font-bold'
                          : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{language === 'bn' ? link.labelBn : link.labelEn}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile "Order Now" Big Button */}
              <Link
                href="/menu"
                className="w-full py-3 rounded-xl bg-white text-[#900C19] font-bold text-center text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <span>{language === 'bn' ? 'অনলাইনে অর্ডার করুন' : 'Order Now'}</span>
              </Link>
            </div>

            {/* Bottom Contact shortcuts */}
            <div className="pt-6 border-t border-white/15 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:01973255888"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-white border border-white/15"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <span>কল করুন</span>
                </a>
                <a
                  href="https://wa.me/8801973255888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 text-[11px] text-white/60 hover:text-white"
              >
                <Shield className="w-3 h-3" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
