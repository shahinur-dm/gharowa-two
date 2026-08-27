'use client';

import React from 'react';
import Image from 'next/image';
import { History, Award, Sparkles, Heart, ShieldCheck, MapPin, Utensils, CheckCircle2 } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import HeritageTimeline from '../../components/HeritageTimeline';

export default function AboutPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Header Banner */}
      <section className="relative py-16 bg-obsidian-600/40 border-b border-gold-500/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
            <History className="w-3.5 h-3.5" />
            <span>প্রতিষ্ঠা: ১৯৭২ • ৫০+ বছরের ঐতিহ্য</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-bengali">
            {language === 'bn' ? 'আমাদের ঐতিহ্যের গল্প' : 'The Legacy of Gharowa'}
          </h1>

          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto font-bengali leading-relaxed">
            {language === 'bn'
              ? '১৯৭২ সাল থেকে মতিঝিলের প্রাণকেন্দ্রে প্রতিটি পদে খাঁটি স্বাদ, সততা ও আস্থার অবিচ্ছেদ্য বন্ধন।'
              : 'Serving authentic culinary heritage and home-cooked warmth in the heart of Motijheel since 1972.'}
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>মতিঝিলের সোনালী ইতিহাস</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-bengali leading-tight">
              যেখান থেকে শুরু হয়েছিল{' '}
              <span className="gold-gradient-text">ঘরোয়া স্বাদের এক অনন্য বিপ্লব</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 font-bengali leading-relaxed">
              ১৯৭২ সালে সদ্য স্বাধীন বাংলাদেশে ঢাকার মতিঝিল যখন দেশের প্রধান বাণিজ্যিক কেন্দ্র হিসেবে গড়ে উঠছিল, তখনই ৯/সি মতিঝিলে প্রতিষ্ঠিত হয় ‘ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট’।
            </p>

            <p className="text-xs sm:text-sm text-gray-300 font-bengali leading-relaxed">
              প্রতিষ্ঠাতা স্বপ্ন দেখেছিলেন ব্যস্ত কর্মজীবীদের জন্য এমন এক খাবারের ঠিকানা, যেখানে পাওয়া যাবে মায়ের হাতের খাঁটি ঘিয়ে রান্না করা খিচুড়ি ও সুস্বাদু কাচ্চির স্বাদ। অর্ধশতাব্দী পেরিয়ে আজ ঘরোয়া ঢাকার খাদ্যসংস্কৃতির এক গৌরবময় প্রতীক।
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold-500/15">
                <h4 className="text-xl font-bold text-gold-400 font-mono">1972</h4>
                <p className="text-xs text-gray-400 mt-1">প্রতিষ্ঠার অবিস্মরণীয় বছর</p>
              </div>
              <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold-500/15">
                <h4 className="text-xl font-bold text-gold-400 font-mono">50+ Years</h4>
                <p className="text-xs text-gray-400 mt-1">ভোজনপ্রেমীদের নিরবচ্ছিন্ন আস্থা</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative h-96 rounded-3xl overflow-hidden border border-gold-500/30 shadow-gold-lg">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop"
                alt="Gharowa Restaurant Heritage Ambience"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-500/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-obsidian-900/80 backdrop-blur-md border border-gold-500/20">
                <p className="text-xs font-semibold text-gold-400">
                  ৯/সি মতিঝিল বা/এ, ঢাকা-১০০০ (মেট্রোরেল স্টেশন সংলগ্ন)
                </p>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  প্রতিদিন শত শত পরিবারের প্রিয় খাবারের গন্তব্য
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kitchen Values & Hygiene */}
      <section className="py-16 bg-obsidian-600/30 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-bengali">
              আমাদের রান্নার ৪টি মূল স্তম্ভ
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              যে কারণে ঘরোয়ার স্বাদ ৫০ বছর ধরে অপরিবর্তিত ও অতুলনীয়।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'খাঁটি খাসির মাংস',
                desc: 'প্রতিদিন সকালে সরাসরি বাছাইকৃত ফ্রেশ কচি খাসির মাংস সংগ্রহ।',
              },
              {
                title: 'গাওয়া ঘি ও নিজস্ব মসলা',
                desc: '১৯৭২ সালের প্রাচীন অনুপাতে পেষা গোপন মসলা ও খাঁটি দেশি গাওয়া ঘি।',
              },
              {
                title: 'লাইভ দম প্রিপারেশন',
                desc: 'অর্ডার অনুযায়ী সঠিক তাপমাত্রায় প্রস্তুতকৃত সুগন্ধি বাসমতী ও চিনিগুঁড়া চাল।',
              },
              {
                title: 'শতভাগ স্বাস্থ্যসম্মত পরিবেশন',
                desc: 'কঠোর স্বাস্থ্যবিধি ও পরিচ্ছন্নতায় প্রস্তুতকৃত খাদ্য।',
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-obsidian-400 border border-gold-500/15 space-y-3"
              >
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center font-bold font-mono text-xs">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-white font-bengali">{pillar.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-bengali">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <HeritageTimeline />
    </div>
  );
}
