'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  Search,
  Filter,
  ExternalLink,
  Plus,
  X,
} from 'lucide-react';
import ImageUploadField from '../../../components/ImageUploadField';

interface MediaItem {
  id: string;
  title: string;
  category: 'hero' | 'food' | 'chef_owner' | 'about' | 'logo' | 'general';
  url: string;
  size?: string;
  addedDate: string;
}

export default function AdminMediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 'm-1',
      title: 'Mutton Bhuna Khichuri Signature Dish',
      category: 'food',
      url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      size: '420 KB',
      addedDate: '2026-08-28',
    },
    {
      id: 'm-2',
      title: 'Special Mutton Kacchi Biryani',
      category: 'food',
      url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
      size: '510 KB',
      addedDate: '2026-08-28',
    },
    {
      id: 'm-3',
      title: 'Old Dhaka Beef Tehari',
      category: 'food',
      url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
      size: '390 KB',
      addedDate: '2026-08-28',
    },
    {
      id: 'm-4',
      title: 'Special Shorshe Ilish (Hilsa)',
      category: 'food',
      url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
      size: '480 KB',
      addedDate: '2026-08-28',
    },
    {
      id: 'm-5',
      title: 'Gharowa Special Borhani Spiced Yogurt',
      category: 'food',
      url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
      size: '310 KB',
      addedDate: '2026-08-28',
    },
    {
      id: 'm-6',
      title: 'Gharowa Special Firni Clay Pot',
      category: 'food',
      url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
      size: '340 KB',
      addedDate: '2026-08-28',
    },
    {
      id: 'm-7',
      title: 'Master Chef Rahman Portrait',
      category: 'chef_owner',
      url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop',
      size: '450 KB',
      addedDate: '2026-08-28',
    },
    {
      id: 'm-8',
      title: 'Founder Alhaj Md. Sirajuddin Portrait',
      category: 'chef_owner',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      size: '410 KB',
      addedDate: '2026-08-28',
    },
    {
      id: 'm-9',
      title: 'Historic Motijheel Dining Hall 1972',
      category: 'about',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
      size: '620 KB',
      addedDate: '2026-08-28',
    },
  ]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [newImage, setNewImage] = useState({
    title: '',
    category: 'food' as MediaItem['category'],
    url: '',
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this media asset?')) return;
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.url) return;

    const newItem: MediaItem = {
      id: `m-${Date.now()}`,
      title: newImage.title || 'Gharowa Asset',
      category: newImage.category,
      url: newImage.url,
      size: 'Uploaded Asset',
      addedDate: new Date().toISOString().split('T')[0],
    };

    setMediaItems([newItem, ...mediaItems]);
    setIsUploadModalOpen(false);
    setNewImage({ title: '', category: 'food', url: '' });
  };

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoriesList = [
    { id: 'all', label: 'সব ছবি (All Media)' },
    { id: 'food', label: 'খাবার (Food & Dishes)' },
    { id: 'hero', label: 'হিরো ব্যানার (Hero Banner)' },
    { id: 'chef_owner', label: 'শেফ ও কর্ণধার (Chef & Owner)' },
    { id: 'about', label: 'আবাউট ও রেস্টুরেন্ট (About & Dining)' },
    { id: 'logo', label: 'লোগো ও ব্র্যান্ড (Logos & Brand)' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <ImageIcon className="w-5 h-5 text-[#900C19]" />
            <span>Media Asset Library (ছবি ও মিডিয়া গ্যালারি)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            খাবারের ছবি, শেফ, কর্ণধার ও ব্যানারের ছবি আপলোড ও URL কপি করে ব্যবহার করুন
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.99]"
        >
          <Upload className="w-4 h-4" />
          <span>নতুন ছবি আপলোড করুন (Upload Image)</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#900C19] text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ছবির নাম খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Media Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:border-[#900C19]/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Image Preview */}
            <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full bg-slate-900/70 text-white backdrop-blur-xs font-medium capitalize">
                {item.category.replace('_', ' ')}
              </span>
            </div>

            {/* Info & Copy Bar */}
            <div className="p-3 space-y-2">
              <h3 className="text-xs font-medium text-slate-900 truncate" title={item.title}>
                {item.title}
              </h3>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className={`inline-flex items-center gap-1 font-medium transition-colors ${
                    copiedId === item.id ? 'text-emerald-700 font-semibold' : 'text-[#900C19] hover:underline'
                  }`}
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Media Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#900C19]" />
                <span>নতুন মিডিয়া যুক্ত করুন (Add Media)</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-3.5 text-xs">
              <ImageUploadField
                label="Image File Upload or Web URL *"
                value={newImage.url}
                onChange={(url) => setNewImage({ ...newImage, url })}
                helperText="Upload image or paste image link."
              />

              <div>
                <label className="block font-medium text-slate-700 mb-1">ছবির নাম / Title *</label>
                <input
                  type="text"
                  required
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="উদা: Mutton Khichuri Signature Dish"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ক্যাটাগরি ফোল্ডার *</label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                >
                  <option value="food">খাবার (Food & Dishes)</option>
                  <option value="hero">হিরো ব্যানার (Hero Banner)</option>
                  <option value="chef_owner">শেফ ও কর্ণধার (Chef & Owner)</option>
                  <option value="about">আবাউট ও রেস্টুরেন্ট (About & Dining)</option>
                  <option value="logo">লোগো ও ব্র্যান্ড (Logos & Brand)</option>
                  <option value="general">সাধারণ (General)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-semibold text-xs shadow-2xs transition-all"
                >
                  গ্যালারিতে যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
