'use client';

import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Utensils, Award } from 'lucide-react';
import ReservationForm from '../../components/ReservationForm';
import { useLanguageStore } from '../../store/languageStore';

export default function ContactPage() {
  const { language } = useLanguageStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs font-bold">
          <Phone className="w-3.5 h-3.5 text-traditional-600" />
          <span>যোগাযোগ ও রিজার্ভেশন সহায়তা</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-bengali">
          টেবিল বুকিং ও কর্পোরেট যোগাযোগ
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-bengali leading-relaxed">
          পারিবারিক গেট-টুগেদার, কর্পোরেট লাঞ্চ মিটিং বা যেকোনো খাদ্যসংক্রান্ত অনুসন্ধানে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6 text-xs sm:text-sm text-slate-700">
            <h2 className="text-lg font-bold text-slate-900 font-bengali border-b border-slate-100 pb-3">
              ঘরোয়া প্রধান কার্যালয় ও রেস্তোরাঁ
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-traditional-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bengali">ঠিকানা:</strong>
                  <span className="text-slate-600">৯/সি মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০ (মেট্রোরেল স্টেশন সংলগ্ন)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-traditional-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bengali">সরাসরি ফোন:</strong>
                  <a href="tel:01973255888" className="text-traditional-700 font-bold font-mono hover:underline">
                    ০১৯৭৩২৫৫৮৮৮
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bengali">হোয়াটসঅ্যাপ অর্ডার ডেস্ক:</strong>
                  <a href="https://wa.me/8801973255888" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold font-mono hover:underline">
                    +8801973255888
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-traditional-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bengali">ডাইনিং সময়সূচি:</strong>
                  <span className="text-slate-600">প্রতিদিন সকাল ৭:০০ - রাত ১১:৩০</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-warm-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-traditional-700" />
              <span>কর্পোরেট ইভেন্ট ও ক্যাটারিং অর্ডার</span>
            </h3>
            <p className="leading-relaxed font-bengali text-slate-600">
              ৫০ থেকে ৫০০ জনের যেকোনো অফিস পার্টি, মিলাদ মাহফিল বা পারিবারিক দাওয়াতের জন্য স্পেশাল খাসির ভুনা খিচুড়ি ও কাচ্চি পার্সেল ডেলিভারি পাওয়া যায়।
            </p>
          </div>
        </div>

        {/* Reservation Form */}
        <div className="lg:col-span-7">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}
