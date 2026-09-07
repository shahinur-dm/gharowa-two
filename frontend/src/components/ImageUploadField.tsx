'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  Link as LinkIcon,
  X,
  Check,
  Image as ImageIcon,
  Loader2,
  FolderOpen,
  Search,
} from 'lucide-react';
import { api } from '../lib/api';
import { compressImageFile } from '../lib/imageCompressor';

interface MediaAssetItem {
  _id?: string;
  id?: string;
  title: string;
  category?: string;
  url: string;
  size?: string;
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  category?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  helperText,
  category = 'general',
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Media Library collection when modal opens
  const openMediaCollection = async () => {
    setIsMediaModalOpen(true);
    setIsLoadingMedia(true);
    try {
      const res: any = await api.get('/admin/media');
      if (res.success && Array.isArray(res.data)) {
        setMediaList(res.data);
      }
    } catch (err) {
      console.warn('Failed to load media collection', err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Auto-compress the image to prevent HTTP 413 (Payload Too Large)
      const compressedDataUrl = await compressImageFile(file, 1000, 1000, 0.82);

      try {
        const res: any = await api.post('/upload', {
          image: compressedDataUrl,
          filename: file.name.split('.')[0],
          category: category,
        });

        if (res.success && res.url) {
          onChange(res.url);
        } else {
          onChange(compressedDataUrl);
        }
      } catch (err: any) {
        console.warn('API upload fallback to compressed data URL', err);
        onChange(compressedDataUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Image processing failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(mediaSearch.toLowerCase());
    const matchesCategory =
      selectedMediaCategory === 'all' || item.category === selectedMediaCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-2 text-xs font-sans">
      <label className="block font-semibold text-slate-800">{label}</label>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Preview Thumbnail */}
        <div className="relative w-24 h-24 rounded-2xl bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-400" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="flex-1 w-full space-y-2.5">
          {/* Direct URL input */}
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... বা ছবির লিঙ্ক লিখুন"
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C19] font-mono text-[11px]"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-rose-600"
                title="রিমুভ করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: 1. Upload From Device, 2. Previous Photo Collection */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 flex items-center gap-1.5 transition-all text-xs active:scale-95 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#900C19]" />
              <span>{isUploading ? 'আপলোড হচ্ছে...' : 'Upload From Device'}</span>
            </button>

            <button
              type="button"
              onClick={openMediaCollection}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#EA580C] font-semibold border border-orange-200 flex items-center gap-1.5 transition-all text-xs active:scale-95 shadow-2xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Previous Photo Collection</span>
            </button>
          </div>

          {helperText && <p className="text-[11px] text-slate-500 font-normal">{helperText}</p>}
          {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        </div>
      </div>

      {/* Previous Photo Collection Modal */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col font-sans">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#900C19]" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Previous Photo Collection (গ্যালারি থেকে ছবি নির্বাচন)
                  </h3>
                  <p className="text-[11px] text-slate-500">যে ছবিটি ব্যবহার করতে চান তার উপর ক্লিক করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {[
                    { id: 'all', label: 'সব (All)' },
                    { id: 'food', label: 'খাবার (Food)' },
                    { id: 'hero', label: 'হিরো (Hero)' },
                    { id: 'chef_owner', label: 'শেফ/কর্ণধার' },
                    { id: 'logo', label: 'লোগো' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedMediaCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                        selectedMediaCategory === cat.id
                          ? 'bg-[#900C19] text-white font-semibold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-52 shrink-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    placeholder="ছবি খুঁজুন..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>
              </div>

              {/* Image Grid */}
              {isLoadingMedia ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#900C19]" />
                  <span>ছবি লোড হচ্ছে...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  কোনো ছবি পাওয়া যায়নি
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
                  {filteredMedia.map((item, idx) => {
                    const isCurrent = value === item.url;
                    return (
                      <div
                        key={item._id || item.id || idx}
                        onClick={() => {
                          onChange(item.url);
                          setIsMediaModalOpen(false);
                        }}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all hover:scale-[1.02] flex flex-col bg-slate-50 ${
                          isCurrent
                            ? 'border-[#900C19] ring-2 ring-[#900C19] shadow-md'
                            : 'border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                          <Image
                            src={item.url}
                            alt={item.title || 'Media item'}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {isCurrent && (
                            <div className="absolute inset-0 bg-[#900C19]/30 flex items-center justify-center">
                              <Check className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                          )}
                        </div>
                        <div className="p-1.5 text-[10px] font-medium text-slate-800 truncate text-center">
                          {item.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end p-3 sm:px-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
