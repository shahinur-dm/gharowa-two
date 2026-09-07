'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Navigation, Train, Car, Compass } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export default function LocationsPage() {
  const { language } = useLanguageStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs font-medium font-sans">
          <MapPin className="w-3.5 h-3.5 text-traditional-600" />
          <span>মতিঝিলের কেন্দ্রস্থলে আমাদের ঠিকানা</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-slate-900 font-sans tracking-tight">
          ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট লোকেশন গাইড
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-bengali font-normal leading-relaxed">
          মতিঝিল মেট্রো স্টেশন ও ঐতিহ্যবাহী শাপলা চত্বরের ঠিক পাশেই আমাদের প্রধান রেস্তোরাঁ ও কর্পোরেট ডাইনিং স্পেস।
        </p>
      </div>

      {/* Main Info Card with Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact & Transit Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6 text-xs sm:text-sm text-slate-700">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-traditional-700 bg-traditional-50 px-2.5 py-1 rounded-full border border-traditional-200 font-sans">
                Flagship Location
              </span>
              <h2 className="text-xl font-semibold text-slate-900 font-sans mt-2">
                ৯/সি মতিঝিল বা/এ, ঢাকা-১০০০
              </h2>
              <p className="text-xs text-slate-500 font-bengali font-normal mt-1">
                মতিঝিল মেট্রোরেল স্টেশন ৩ নং এক্সিট ও শাপলা চত্বর থেকে মাত্র ১ মিনিটের হাঁটা দূরত্ব।
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-traditional-700 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-bengali">খোলা থাকার সময়:</strong>
                  <span className="text-slate-500">প্রতিদিন সকাল ৭:০০ টা হতে রাত ১১:৩০ টা পর্যন্ত</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-traditional-700 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-bengali">সরাসরি হটলাইন:</strong>
                  <a href="tel:01973255888" className="text-traditional-700 font-bold font-mono hover:underline">
                    ০১৯৭৩২৫৫৮৮৮
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-bengali">WhatsApp কাস্টমার কেয়ার:</strong>
                  <a href="https://wa.me/8801973255888" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold font-mono hover:underline">
                    +8801973255888
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Directions Button */}
            <a
              href="https://maps.google.com/?q=Motijheel+Dhaka+Gharowa+Restaurant"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-traditional-700 hover:bg-traditional-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-red transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>গুগল ম্যাপে দিকনির্দেশনা দেখুন (Google Maps)</span>
            </a>
          </div>

          {/* Transportation Guide */}
          <div className="p-6 rounded-3xl bg-warm-50 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-2">
              <Train className="w-4 h-4 text-traditional-700" />
              <span>কীভাবে আসবেন? (How to Reach)</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600 font-bengali">
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-traditional-50 text-traditional-700 flex items-center justify-center font-bold shrink-0">
                  ১
                </span>
                <p>
                  <strong>মেট্রোরেল যোগে:</strong> মতিঝিল মেট্রো স্টেশনে নেমে ৩ নং এক্সিট দিয়ে বের হয়ে পূর্ব দিকে ৫০ মিটার এগিয়ে গেলেই আমাদের প্রধান ফটক।
                </p>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-traditional-50 text-traditional-700 flex items-center justify-center font-bold shrink-0">
                  ২
                </span>
                <p>
                  <strong>বাস বা রিকশা যোগে:</strong> শাপলা চত্বর গোলচত্বর থেকে সোনালী ব্যাংক প্রধান কার্যালয় সংলগ্ন লেন দিয়ে সহজে পৌঁছানো যায়।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Map Frame */}
        <div className="lg:col-span-7 h-[480px] rounded-3xl overflow-hidden border border-slate-200 shadow-card bg-slate-100 relative">
          <iframe
            title="Gharowa Hotel Motijheel Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.4839843657787!2d90.41505697598835!3d23.73010198956973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85bd7b2a6f7%3A0xb36ef8df9d43ec34!2sMotijheel%2C%20Dhaka%201000!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
