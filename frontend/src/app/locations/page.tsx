'use client';

import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Navigation, Train, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export default function LocationsPage() {
  const { language } = useLanguageStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'আমাদের লোকেশন ও যাতায়াত' : 'Restaurant Location & Guide'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-bengali">
          {language === 'bn' ? 'মতিঝিল প্রধান ব্রাঞ্চ' : 'Motijheel Flagship Branch'}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 font-bengali leading-relaxed">
          {language === 'bn'
            ? 'মতিঝিল মেট্রোরেল স্টেশন এবং শাপলা চত্বর থেকে মাত্র কয়েক কদমের দূরত্বে।'
            : 'Conveniently located next to Motijheel Metro Rail Station & Shapla Chottor.'}
        </p>
      </div>

      {/* Main Location Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Info Column */}
        <div className="lg:col-span-6 p-8 rounded-3xl bg-obsidian-400 border border-gold-500/25 shadow-gold-lg flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-bengali">
                  ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট
                </h3>
                <p className="text-xs text-gold-400 font-mono">ESTD 1972 • MOTIJHEEL DHAKA</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-gray-300">
              <div className="p-3.5 rounded-2xl bg-obsidian-300 border border-gold-500/15 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block font-bengali">পূর্ণাঙ্গ ঠিকানা:</strong>
                  <span>৯/সি, মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-obsidian-300 border border-gold-500/15 flex items-start gap-3">
                <Train className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block font-bengali">ল্যান্ডমার্ক ও মেট্রো দিকনির্দেশনা:</strong>
                  <span>মতিঝিল মেট্রোরেল স্টেশন থেকে শাপলা চত্বরের দিকে ডান পাশের রাস্তায় ১ মিনিটের হাঁটা দূরত্ব।</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-obsidian-300 border border-gold-500/15 flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block font-bengali">খোলা থাকার সময়:</strong>
                  <span>প্রতিদিন সকাল ৭:০০ টা থেকে রাত ১১:৩০ টা পর্যন্ত নিরবচ্ছিন্ন সেবা</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-obsidian-300 border border-gold-500/15 flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block font-bengali">ফোন ও হোম ডেলিভারি:</strong>
                  <a href="tel:01973255888" className="text-gold-300 font-bold hover:underline">
                    ০১৯৭৩২৫৫৮৮৮
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="https://maps.google.com/?q=9/C+Motijheel+C/A+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 shadow-gold transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Google Maps এ দেখুন</span>
            </a>

            <a
              href="https://wa.me/8801973255888"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp মেসেজ</span>
            </a>
          </div>
        </div>

        {/* Map Visual Component */}
        <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-obsidian-400 border border-gold-500/25 p-4 flex flex-col justify-between">
          <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-obsidian-300 border border-gold-500/15">
            {/* Styled Map Graphic representation */}
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="w-14 h-14 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center shadow-gold animate-bounce">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-bengali">
                  ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (১৯৭২)
                </h4>
                <p className="text-xs text-gold-400 font-medium">
                  ৯/সি মতিঝিল বা/এ • শাপলা চত্বর সংলগ্ন
                </p>
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs">
                মতিঝিল মেট্রোরেল থেকে সরাসরি হেঁটে আসার সবচেয়ে সহজ পথ
              </p>
            </div>
          </div>

          <div className="p-4 bg-obsidian-300/80 rounded-2xl border border-white/5 mt-4 flex items-center justify-between text-xs text-gray-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>পার্কিং ও এসি ডাইনিং হল সুবিধা রয়েছে</span>
            </span>
            <a
              href="https://maps.google.com/?q=9/C+Motijheel+C/A+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
            >
              <span>ডিরেকশন নিন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
