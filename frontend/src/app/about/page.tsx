'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Award, ShieldCheck, HeartHandshake, History, UtensilsCrossed } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import HeritageTimeline from '../../components/HeritageTimeline';

export default function AboutPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-16 py-10 pb-20">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs font-medium font-sans">
          <History className="w-3.5 h-3.5 text-traditional-600" />
          <span>১৯৭২ থেকে ভোজনরসিকদের ভালোবাসায়</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-slate-900 font-sans tracking-tight">
          ৫০+ বছরের ঐতিহ্যবাহী ঘরোয়া স্বাদ ও গল্প
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-bengali font-normal max-w-2xl mx-auto leading-relaxed">
          স্বাধীনতার পর ১৯৭২ সালে ঢাকার মতিঝিলের বাণিজ্যিক হৃদয়ে শুরু হয় ঘরোয়া হোটেল। খাঁটি দেশি খাসির মাংস, চিনিগুঁড়া চাল আর নিজস্ব গোপন মসলার সুবাসে আমরা গড়ে তুলেছি আস্থার এক অমর ঐতিহ্য।
        </p>
      </section>

      {/* Origin Story Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative h-96 rounded-3xl overflow-hidden shadow-card border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
              alt="Gharowa Dining Heritage"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5 text-slate-700 font-bengali text-xs sm:text-sm leading-relaxed font-normal">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 font-sans tracking-tight">
              মতিঝিলের হৃৎপিণ্ডে একটি খাঁটি রেস্তোরাঁ সংস্কৃতি
            </h2>
            <p>
              মতিঝিল কেবল ঢাকা বা বাংলাদেশের বাণিজ্যিক কেন্দ্র নয়—এটি কোটি মানুষের কর্মব্যস্ত দিনযাপনের কেন্দ্র। গত অর্ধশতাব্দী ধরে ব্যাংক কর্মকর্তা, ব্যবসায়ী, চাকরিজীবী থেকে শুরু করে দূর-দূরান্ত থেকে আসা খাদ্যপ্রেমীদের কাছে ঘরোয়া হোটেল মানেই দুপুরের তৃপ্তিদায়ক খাবারের বিশ্বস্ত ঠিকানা।
            </p>
            <p>
              আমাদের ঐতিহ্যবাহী <strong className="font-semibold text-slate-900">খাসির ভুনা খিচুড়ি</strong> এবং <strong className="font-semibold text-slate-900">লেগ খিচুড়ি</strong> ঢাকার রসনাবিলাসে এক অনন্য দৃষ্টান্ত। প্রতিটি পাত্রে আমরা নিশ্চিত করি নিখুঁত খাঁটি গাওয়া ঘি, পরিচ্ছন্ন রান্নাবান্না এবং পরম যত্নে তৈরি আপ্যায়ন।
            </p>
          </div>
        </div>
      </section>

      {/* Heritage Values Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-traditional-50 border border-traditional-200 text-traditional-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 font-sans">স্বাদে আপসহীন গুণমান</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-bengali font-normal">
              আমরা কখনো কোনো কৃত্রিম স্বাদ বা রাসায়নিক উপাদান ব্যবহার করি না। খাঁটি মশলা ও সেরা খাসির নিশ্চয়তা।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-traditional-50 border border-traditional-200 text-traditional-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 font-sans">স্বাস্থ্য ও পরিচ্ছন্নতা</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-bengali font-normal">
              কিচেন কর্মীদের সর্বোচ্চ স্বাস্থ্যবিধি মেনে চলা এবং ১০০% হালাল জবাইকৃত মাংস নির্বাচন করা হয়।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-traditional-50 border border-traditional-200 text-traditional-700 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 font-sans">ঘরোয়া আতিথেয়তা</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-bengali font-normal">
              নামেই ঘরোয়া—আমাদের সেবা ও ডাইনিং পরিবেশে পাবেন পারিবারিক আন্তরিকতা ও স্বাচ্ছন্দ্য।
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <HeritageTimeline />
    </div>
  );
}
