'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Link as LinkIcon, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { compressImageFile } from '../lib/imageCompressor';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  helperText,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="flex-1 w-full space-y-2">
          {/* Direct URL input */}
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... বা ইমেজ লিংক লিখুন"
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C19] font-mono text-[11px]"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-rose-600"
                title="রিমুভ করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-2">
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
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 flex items-center gap-1.5 transition-all text-xs active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#900C19]" />
              <span>{isUploading ? 'অপ্টিমাইজ ও আপলোড হচ্ছে...' : 'ডিভাইস থেকে ছবি আপলোড করুন'}</span>
            </button>
          </div>

          {helperText && <p className="text-[11px] text-slate-500 font-normal">{helperText}</p>}
          {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}
