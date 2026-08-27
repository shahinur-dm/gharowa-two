'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Mail,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

export default function Footer() {
  const { language } = useLanguageStore();

  return (
    <footer className="relative bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Heritage Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-traditional-700 p-0.5 shadow-md">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <span className="text-lg font-bold text-traditional-700 font-serif">GH</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-bengali">
                  ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট
                </h3>
                <p className="text-xs text-amber-400 font-semibold font-mono">Since 1972 • 50+ Years Heritage</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-bengali">
              {language === 'bn'
                ? '১৯৭২ সাল থেকে মতিঝিলের প্রাণকেন্দ্রে খাঁটি ঘরোয়া স্বাদের বিশ্বস্ত ঠিকানা। খাসির ভুনা খিচুড়ি ও কাচ্চির ঐতিহ্যে আমরা আপসহীন।'
                : 'Since 1972, Motijheel’s timeless sanctuary for authentic culinary heritage. Famous for our iconic Mutton Bhuna Khichuri & Kacchi.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>১০০% হালাল ও স্বাস্থ্যসম্মত পরিবেশন</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-traditional-400" />
              {language === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/menu" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <ArrowUpRight className="w-3 h-3 text-traditional-400" />
                  {language === 'bn' ? 'আমাদের মেনু' : 'Explore Menu'}
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <ArrowUpRight className="w-3 h-3 text-traditional-400" />
                  {language === 'bn' ? 'স্পেশাল অফার ও কুপন' : 'Offers & Deals'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <ArrowUpRight className="w-3 h-3 text-traditional-400" />
                  {language === 'bn' ? '১৯৭২ থেকে আমাদের গল্প' : 'Our Heritage Story'}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <ArrowUpRight className="w-3 h-3 text-traditional-400" />
                  {language === 'bn' ? 'রেস্টুরেন্ট গ্যালারি' : 'Photo Gallery'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <ArrowUpRight className="w-3 h-3 text-traditional-400" />
                  {language === 'bn' ? 'টেবিল বুকিং ও ক্যাটারিং' : 'Table Booking & Catering'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Opening Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-traditional-400" />
              {language === 'bn' ? 'ঠিকানা ও সময়' : 'Location & Hours'}
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-traditional-400 shrink-0 mt-0.5" />
                <span>
                  ৯/সি, মতিঝিল বা/এ, ঢাকা-১০০০
                  <br />
                  <span className="text-slate-400">(মতিঝিল মেট্রোরেল ও শাপলা চত্বর সংলগ্ন)</span>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-traditional-400 shrink-0" />
                <span>সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-traditional-400 shrink-0" />
                <a href="tel:01973255888" className="hover:text-amber-400 font-bold">০১৯৭৩২৫৫৮৮৮</a>
              </p>
            </div>
          </div>

          {/* Instant WhatsApp Order & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct Connect'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-bengali">
              যেকোনো কর্পোরেট অর্ডার, ফ্যামিলি ক্যাটারিং বা এক্সপ্রেস ডেলিভারির জন্য সরাসরি WhatsApp-এ বার্তা পাঠান।
            </p>
            <a
              href="https://wa.me/8801973255888"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp-এ বার্তা দিন</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 1972 - 2026 Gharowa Hotel & Restaurant. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/locations" className="hover:text-amber-400">মতিঝিল ঢাকা</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-amber-400 text-slate-400">Admin ERP Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
