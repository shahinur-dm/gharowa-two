'use client';

import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Sparkles, Send } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import ReservationForm from '../../components/ReservationForm';

export default function ContactPage() {
  const { language } = useLanguageStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <Phone className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'যোগাযোগ ও বুকিং' : 'Contact & Table Booking'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-bengali">
          {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch with Us'}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 font-bengali leading-relaxed">
          {language === 'bn'
            ? 'টেবিল রিজার্ভেশন, কর্পোরেট ক্যাটারিং অথবা যেকোনো তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।'
            : 'For reservations, corporate catering inquiries, or general support, connect with us anytime.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Contact Information & Direct WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-400 border border-gold-500/20 space-y-6">
            <h3 className="text-lg font-bold text-white font-bengali">
              সরাসরি যোগাযোগ ও হটলাইন
            </h3>

            <div className="space-y-4 text-xs text-gray-300">
              <a
                href="tel:01973255888"
                className="p-3.5 rounded-2xl bg-obsidian-300 border border-gold-500/15 flex items-center gap-3 hover:border-gold-500/40 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">হটলাইন নম্বর</span>
                  <strong className="text-white text-sm font-mono">০১৯৭৩২৫৫৮৮৮</strong>
                </div>
              </a>

              <a
                href="https://wa.me/8801973255888"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-obsidian-300 border border-emerald-500/20 flex items-center gap-3 hover:border-emerald-500/50 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">WhatsApp চ্যাট ও কুইক অর্ডার</span>
                  <strong className="text-emerald-400 text-sm font-mono">+880 1973-255888</strong>
                </div>
              </a>

              <div className="p-3.5 rounded-2xl bg-obsidian-300 border border-gold-500/15 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">ঠিকানা</span>
                  <span className="text-white text-xs">৯/সি, মতিঝিল বা/এ, ঢাকা-১০০০</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-obsidian-300 border border-gold-500/15 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">পরিষেবা সময়সূচী</span>
                  <span className="text-white text-xs">সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/8801973255888"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp-এ সরাসরি কথা বলুন</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Table Reservation Form */}
        <div className="lg:col-span-7">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}
