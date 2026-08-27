'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, X, Camera, Eye } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export default function GalleryPage() {
  const { language } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const galleryItems = [
    {
      id: 1,
      titleBn: 'খাসির ভুনা খিচুড়ি সিগনেচার পরিবেশন',
      titleEn: 'Signature Mutton Bhuna Khichuri',
      category: 'dishes',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      titleBn: 'আস্ত খাসির রানের লেগ খিচুড়ি',
      titleEn: 'Special Mutton Shank Khichuri',
      category: 'dishes',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 3,
      titleBn: 'ঐতিহ্যবাহী জাফরানি কাচ্চি বিরিয়ানি',
      titleEn: 'Heritage Saffron Kacchi Dum Biryani',
      category: 'dishes',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 4,
      titleBn: 'মতিঝিল শীতাতপ নিয়ন্ত্রিত ডাইনিং হল',
      titleEn: 'Motijheel AC Family Dining Hall',
      category: 'ambiance',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 5,
      titleBn: 'কয়লার আগুনে কাবাব প্রিপারেশন',
      titleEn: 'Charcoal Kebab Master Kitchen',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 6,
      titleBn: 'পদ্মার খাঁটি সরিষা ইলিশ ও রূপচাঁদা ফ্রাই',
      titleEn: 'Hilsa & Pomfret Fish Delicacy',
      category: 'dishes',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 7,
      titleBn: 'ঐতিহ্যবাহী বোরহানি ও ফিরনি ডেজার্ট',
      titleEn: 'Traditional Borhani & Clay Pot Firni',
      category: 'dishes',
      image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 8,
      titleBn: 'ভিআইপি ও কর্পোরেট ডাইনিং স্পেস',
      titleEn: 'VIP & Corporate Dining Section',
      category: 'ambiance',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-traditional-50 border border-traditional-200 text-traditional-800 text-xs font-bold">
          <Camera className="w-3.5 h-3.5 text-traditional-600" />
          <span>ঘরোয়ার মনোরম ডাইনিং ও খাবারের গ্যালারি</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-bengali">
          ছবিতে ঘরোয়া রেস্টুরেন্ট
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-bengali leading-relaxed">
          আমাদের সিগনেচার রান্নাবান্না, লাইভ কিচেন প্রস্তুতি এবং মতিঝিল ডাইনিং হলের এক ঝলক।
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-2">
        {[
          { id: 'all', bn: 'সব ছবি', en: 'All Photos' },
          { id: 'dishes', bn: 'সিগনেচার খাবার', en: 'Dishes' },
          { id: 'ambiance', bn: 'রেস্টুরেন্ট পরিবেশ', en: 'Ambiance' },
          { id: 'kitchen', bn: 'লাইভ কিচেন', en: 'Kitchen' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === tab.id
                ? 'bg-traditional-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-traditional-700 border border-slate-200'
            }`}
          >
            {language === 'bn' ? tab.bn : tab.en}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-card-hover cursor-pointer transition-all"
          >
            <Image
              src={item.image}
              alt={item.titleEn}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="text-xs sm:text-sm font-bold font-bengali line-clamp-1">
                {language === 'bn' ? item.titleBn : item.titleEn}
              </h3>
              <span className="text-[10px] text-amber-300 font-medium capitalize">
                {item.category}
              </span>
            </div>

            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[480px] w-full bg-slate-950">
              <Image
                src={selectedImage.image}
                alt={selectedImage.titleEn}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-5 bg-white flex items-center justify-between border-t border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-bengali">
                  {language === 'bn' ? selectedImage.titleBn : selectedImage.titleEn}
                </h3>
                <p className="text-xs text-slate-500 capitalize">{selectedImage.category}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
