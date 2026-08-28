'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Link as LinkIcon, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

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

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res: any = await api.post('/upload', {
            image: base64Data,
            filename: file.name.split('.')[0],
          });

          if (res.success && res.url) {
            onChange(res.url);
          } else {
            // If backend upload wasn't saved, use base64 preview directly
            onChange(base64Data);
          }
        } catch (err: any) {
          console.warn('API upload failed, using data URL fallback', err);
          onChange(base64Data);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <label className="block font-semibold text-gray-200">{label}</label>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Preview Thumbnail */}
        <div className="relative w-24 h-24 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-600" />
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
            <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or /uploads/..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2.5 top-3 text-gray-400 hover:text-rose-400"
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
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 flex items-center gap-1.5 transition-all text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'আপলোড হচ্ছে...' : 'ডিভাইস থেকে ছবি আপলোড করুন'}</span>
            </button>
          </div>

          {helperText && <p className="text-[10px] text-gray-400">{helperText}</p>}
          {error && <p className="text-[10px] text-rose-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
