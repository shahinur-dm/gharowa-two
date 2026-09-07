'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Quote, Sparkles, Heart } from 'lucide-react';
import { RestaurantSettings } from '../types';
import { useLanguageStore } from '../store/languageStore';

interface ChefAndOwnerProps {
  settings?: RestaurantSettings | null;
}

export default function ChefAndOwnerSection({ settings }: ChefAndOwnerProps) {
  const { language } = useLanguageStore();

  const chefName =
    language === 'bn'
      ? settings?.chefNameBn || 'মাস্টার শেফ রফিকুল ইসলাম'
      : settings?.chefNameEn || 'Master Chef Rafiqul Islam';

  const chefDesignation =
    language === 'bn'
      ? settings?.chefTitleBn || 'প্রধান বাবুর্চি (Head Chef)'
      : settings?.chefTitleEn || 'Head Chef (30+ Years Experience)';

  const chefBio =
    language === 'bn'
      ? settings?.chefBioBn || '২৫ বছরেরও বেশি রন্ধন অভিজ্ঞতায় ঐতিহ্যবাহী মসলা ও খাঁটি ঘরোয়া স্বাদের ধারক।'
      : settings?.chefBioEn || 'Preserving the original secret spice recipes of Gharowa for over 30 years.';

  const chefExperience = settings?.chefExperience || '30+ Years Experience';
  const chefSpecialty = settings?.chefSpecialty || 'Dum Pukht & Heritage Khichuri';
  const chefImage =
    settings?.chefImageUrl ||
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop';

  const ownerName =
    language === 'bn'
      ? settings?.ownerNameBn || 'হাজী মোহাম্মদ নূর হোসেন'
      : settings?.ownerNameEn || 'Haji Mohammad Nur Hossain';

  const ownerDesignation =
    language === 'bn'
      ? settings?.ownerTitleBn || 'প্রতিষ্ঠাতা ও স্বত্বাধিকারী'
      : settings?.ownerTitleEn || 'Founder & Proprietor';

  const ownerStory =
    language === 'bn'
      ? settings?.ownerStoryBn ||
        '১৯৭২ সালে মতিঝিলে ছোট্ট পরিসরে শুরু করা ঘরোয়া আজ ঢাকার ঐতিহ্যের অংশ। আমাদের অঙ্গীকার কেবল মান ও খাঁটি স্বাদ।'
      : settings?.ownerStoryEn ||
        'Founded with the philosophy that great food brings families and hearts together with honesty and passion.';

  const ownerQuote =
    language === 'bn'
      ? settings?.ownerQuoteBn || 'খাবারের মানের সাথে কোনো আপস নয় — এটাই ১৯৭২ সাল থেকে আমাদের প্রতিজ্ঞা।'
      : settings?.ownerQuoteEn || 'No compromise on food quality and customer satisfaction since 1972.';

  const ownerImage =
    settings?.ownerImageUrl ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop';

  return (
    <section id="chef-owner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-t border-slate-200/70">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="text-[11px] font-medium tracking-wider text-[#900C19] uppercase mb-1 font-sans">
          {language === 'bn' ? 'আমাদের কারিগর ও কর্ণধার' : 'LEADERSHIP & CULINARY MASTERS'}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-slate-900 font-sans tracking-tight">
          {language === 'bn' ? 'শেফ ও প্রতিষ্ঠাতা পরিচিতি' : 'Meet Our Chef & Owner'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Chef Card */}
        <div id="chef" className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 hover:border-red-200 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row gap-6 items-center">
          <div className="relative w-36 sm:w-44 aspect-square rounded-2xl overflow-hidden border-2 border-[#900C19]/20 shadow-md shrink-0">
            <Image
              src={chefImage}
              alt={chefName}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2 bg-[#900C19] text-white p-1 rounded-md shadow-sm">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2.5 text-center sm:text-left">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-50 text-[#900C19] text-[10px] font-medium tracking-wide font-sans">
              {chefExperience}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 font-sans">
              {chefName}
            </h3>
            <p className="text-xs font-medium text-amber-700 font-sans">
              {chefDesignation}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-normal font-bengali">
              {chefBio}
            </p>
            <div className="text-[11px] text-slate-500 font-normal pt-1">
              <span className="text-slate-800 font-medium">{language === 'bn' ? 'বিশেষত্ব: ' : 'Specialty: '}</span>
              {chefSpecialty}
            </div>
          </div>
        </div>

        {/* Owner Card */}
        <div id="owner" className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 hover:border-red-200 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row gap-6 items-center">
          <div className="relative w-36 sm:w-44 aspect-square rounded-2xl overflow-hidden border-2 border-amber-600/20 shadow-md shrink-0">
            <Image
              src={ownerImage}
              alt={ownerName}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2 bg-amber-600 text-white p-1 rounded-md shadow-sm">
              <Quote className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2.5 text-center sm:text-left">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-medium tracking-wide font-sans">
              {language === 'bn' ? 'প্রতিষ্ঠাতা • ১৯৭২' : 'FOUNDER • SINCE 1972'}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 font-sans">
              {ownerName}
            </h3>
            <p className="text-xs font-medium text-amber-700 font-sans">
              {ownerDesignation}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-normal font-bengali">
              {ownerStory}
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-[11px] text-slate-700 italic font-normal">
              "{ownerQuote}"
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
