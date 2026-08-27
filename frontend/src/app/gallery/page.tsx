'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, ZoomIn } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

interface GalleryItem {
  id: number;
  category: 'ambience' | 'kitchen' | 'cooking' | 'food' | 'heritage';
  titleBn: string;
  titleEn: string;
  imageUrl: string;
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    category: 'food',
    titleBn: 'ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি থালি',
    titleEn: 'Signature Mutton Bhuna Khichuri Platter',
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    category: 'food',
    titleBn: 'রসালো খাসির লেগ ভুনা খিচুড়ি',
    titleEn: 'Tender Mutton Shank Khichuri',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    category: 'ambience',
    titleBn: 'মতিঝিল ব্রাঞ্চের ডাইনিং হল ও নিরিবিলি পরিবেশ',
    titleEn: 'Spacious Motijheel Main Dining Hall',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    category: 'cooking',
    titleBn: 'কয়লার আগুনে কাবাব ও তাজা নান প্রস্তুতকরণ',
    titleEn: 'Live Charcoal Kebab & Naan Baking',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    category: 'food',
    titleBn: 'জাফরানি দম কাচ্চি বিরিয়ানি',
    titleEn: 'Fragrant Dum Kacchi Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    category: 'kitchen',
    titleBn: 'খাঁটি দেশি ঘিয়ে মসলা কষানো ও হাইজিন স্ট্যান্ডার্ড',
    titleEn: 'Pure Ghee Simmering & Modern Hygiene Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    category: 'heritage',
    titleBn: 'মাটির পাত্রে পরিবেশিত স্পেশাল শাহী ফিরনি',
    titleEn: 'Authentic Clay-Pot Shahi Firni',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    category: 'food',
    titleBn: 'তাজা পদ্মার সরিষা ইলিশ পেটি',
    titleEn: 'Fresh Padma Shorshe Ilish Steak',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
  },
];

export default function GalleryPage() {
  const { language } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    selectedCategory === 'all'
      ? galleryData
      : galleryData.filter((item) => item.category === selectedCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev! + 1) % filteredImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ফটোগ্যালারি ও স্মৃতি' : 'Photo Gallery & Ambience'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-bengali">
          {language === 'bn' ? 'ঘরোয়ার অন্দরমহল ও খাবারের ছবি' : 'Moments & Flavors of Gharowa'}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 font-bengali leading-relaxed">
          {language === 'bn'
            ? 'আমাদের সুস্বাদু খাবার, লাইভ কিচেন, পরিচ্ছন্ন ডাইনিং এবং মতিঝিলের ঐতিহাসিক ঐতিহ্যের কিছু মুহূর্ত।'
            : 'A glimpse into our appetizing dishes, hygienic live kitchen, and Motijheel dining ambience.'}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', bn: 'সব ছবি', en: 'All Photos' },
          { id: 'food', bn: 'খাবার', en: 'Signature Food' },
          { id: 'ambience', bn: 'রেস্টুরেন্ট পরিবেশ', en: 'Ambience' },
          { id: 'kitchen', bn: 'কিচেন ও হাইজিন', en: 'Kitchen' },
          { id: 'cooking', bn: 'লাইভ কুকিং', en: 'Live Cooking' },
          { id: 'heritage', bn: 'ঐতিহ্য', en: 'Heritage' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === tab.id
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold'
                : 'bg-obsidian-400 text-gray-300 hover:text-white border border-gold-500/15 hover:border-gold-500/40'
            }`}
          >
            {language === 'bn' ? tab.bn : tab.en}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredImages.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(idx)}
            className="group relative h-72 rounded-3xl overflow-hidden bg-obsidian-400 border border-gold-500/20 hover:border-gold-500/50 cursor-pointer transition-all duration-300 hover:shadow-gold hover:-translate-y-1"
          >
            <Image
              src={item.imageUrl}
              alt={item.titleEn}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute bottom-4 left-4 right-4 text-left">
              <h4 className="text-sm font-bold text-white font-bengali group-hover:text-gold-300 transition-colors">
                {language === 'bn' ? item.titleBn : item.titleEn}
              </h4>
              <p className="text-[11px] text-gray-400 font-medium capitalize mt-0.5">
                {item.category}
              </p>
            </div>

            <div className="absolute top-4 right-4 p-2 rounded-full bg-obsidian-900/80 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-obsidian-400/80 hover:bg-obsidian-300 text-white z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={() =>
              setLightboxIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length)
            }
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-obsidian-400/80 hover:bg-obsidian-300 text-white z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev! + 1) % filteredImages.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-obsidian-400/80 hover:bg-obsidian-300 text-white z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full h-[70vh] rounded-2xl overflow-hidden">
            <Image
              src={filteredImages[lightboxIndex].imageUrl}
              alt={filteredImages[lightboxIndex].titleEn}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-4 left-4 right-4 text-center bg-obsidian-900/80 backdrop-blur-md p-3 rounded-xl max-w-md mx-auto border border-gold-500/20">
              <h3 className="text-sm font-bold text-white font-bengali">
                {language === 'bn'
                  ? filteredImages[lightboxIndex].titleBn
                  : filteredImages[lightboxIndex].titleEn}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
