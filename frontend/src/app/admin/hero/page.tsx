'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { HeroSlide } from '../../../types';
import { api } from '../../../lib/api';
import ImageUploadField from '../../../components/ImageUploadField';

export default function AdminHeroBannerPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteCandidate, setDeleteCandidate] = useState<HeroSlide | null>(null);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    mainImageUrl: '',
    supportingImageUrl: '',
    badgeText: '1972',
    displayOrder: 0,
    slideDurationSeconds: 4,
    isActive: true,
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/hero-slides');
      if (res.success && Array.isArray(res.data)) {
        setSlides(res.data);
      }
    } catch (err: any) {
      showToast('error', 'হিরো স্লাইড তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAddModal = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      mainImageUrl: '',
      supportingImageUrl: '',
      badgeText: '1972',
      displayOrder: slides.length + 1,
      slideDurationSeconds: 4,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      mainImageUrl: slide.mainImageUrl || '',
      supportingImageUrl: slide.supportingImageUrl || '',
      badgeText: slide.badgeText || '1972',
      displayOrder: slide.displayOrder || 0,
      slideDurationSeconds: slide.slideDurationSeconds || 4,
      isActive: slide.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mainImageUrl.trim()) {
      showToast('error', 'মূল খাবারের ছবির লিঙ্ক (Main Image URL) পূরণ করুন');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingSlide) {
        const res = await api.put(`/admin/hero-slides/${editingSlide._id}`, formData);
        if (res.success) {
          showToast('success', 'হিরো স্লাইড তথ্য সফলভাবে আপডেট হয়েছে');
          setIsModalOpen(false);
          fetchSlides();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gharowa_cms_updated'));
          }
        } else {
          showToast('error', res.message || 'আপডেট করতে সমস্যা হয়েছে');
        }
      } else {
        const res = await api.post('/admin/hero-slides', formData);
        if (res.success) {
          showToast('success', 'নতুন হিরো স্লাইড সফলভাবে যোগ করা হয়েছে');
          setIsModalOpen(false);
          fetchSlides();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gharowa_cms_updated'));
          }
        } else {
          showToast('error', res.message || 'যোগ করতে সমস্যা হয়েছে');
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'অপারেশন সম্পন্ন হয়নি');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (slide: HeroSlide) => {
    try {
      const updatedStatus = !slide.isActive;
      const res = await api.put(`/admin/hero-slides/${slide._id}`, { isActive: updatedStatus });
      if (res.success) {
        setSlides((prev) =>
          prev.map((s) => (s._id === slide._id ? { ...s, isActive: updatedStatus } : s))
        );
        showToast('success', `স্লাইড ${updatedStatus ? 'সক্রিয় (Enabled)' : 'নিষ্ক্রিয় (Disabled)'} করা হয়েছে`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gharowa_cms_updated'));
        }
      }
    } catch (err) {
      showToast('error', 'স্ট্যাটাস পরিবর্তন করা যায়নি');
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      const res = await api.delete(`/admin/hero-slides/${deleteCandidate._id}`);
      if (res.success) {
        setSlides((prev) => prev.filter((s) => s._id !== deleteCandidate._id));
        showToast('success', 'হিরো স্লাইড সফলভাবে মুছে ফেলা হয়েছে');
      } else {
        showToast('error', res.message || 'মুছে ফেলতে ব্যর্থ');
      }
    } catch (err) {
      showToast('error', 'স্লাইড ডিলিট করতে সমস্যা হয়েছে');
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-[#EA580C]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Hero Banner — Dynamic Food Slides
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                হোমপেজ হিরো ব্যানারের ডান পাশের ঘূর্ণায়মান খাবার ছবি (Carousel Slides) পরিচালনা করুন
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন হিরো স্লাইড যোগ করুন</span>
        </button>
      </div>

      {/* Slides List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#EA580C] mb-3" />
          <p className="text-sm">হিরো স্লাইড তালিকা লোড হচ্ছে...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">কোনো হিরো স্লাইড যুক্ত নেই</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            হিরো ব্যানারে ঘূর্ণায়মান ছবি যুক্ত করতে "নতুন হিরো স্লাইড যোগ করুন" বাটনে ক্লিক করুন।
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            স্লাইড যুক্ত করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {slides.map((slide) => (
            <div
              key={slide._id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                slide.isActive ? 'border-slate-200 shadow-2xs' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-square bg-slate-900 overflow-hidden group">
                <img
                  src={slide.mainImageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Supporting image badge on top-right */}
                {slide.supportingImageUrl && (
                  <div className="absolute top-2 right-2 w-14 h-12 rounded-lg border-2 border-white overflow-hidden shadow-md">
                    <img
                      src={slide.supportingImageUrl}
                      alt="Supporting preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Order & Duration Badges */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white">
                  <span className="font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs">
                    ক্রম: {slide.displayOrder}
                  </span>
                  <span className="font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{slide.slideDurationSeconds || 4}s</span>
                  </span>
                </div>
              </div>

              {/* Slide Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{slide.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ব্যাজ লেখা: <span className="text-slate-700 font-semibold">{slide.badgeText || '1972'}</span>
                  </p>
                </div>

                {/* Actions Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleStatus(slide)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                      slide.isActive
                        ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{slide.isActive ? 'Active' : 'Disabled'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(slide)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Edit slide"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(slide)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Delete slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-lg max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#EA580C]" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingSlide ? 'হিরো স্লাইড সম্পাদনা করুন' : 'নতুন হিরো স্লাইড যোগ করুন'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    খাবারের নাম / শিরোনাম (Title / Food Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Mutton Khichuri / Kacchi"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>

                <ImageUploadField
                  label="মূল খাবারের ছবি (Main Dish Image) *"
                  value={formData.mainImageUrl}
                  onChange={(url) => setFormData({ ...formData, mainImageUrl: url })}
                  category="hero"
                  helperText="Upload From Device অথবা Previous Photo Collection থেকে ছবি নির্বাচন করুন।"
                />

                <ImageUploadField
                  label="টপ-রাইট সাপোর্টিং ছবি (Optional Supporting Dish Image)"
                  value={formData.supportingImageUrl}
                  onChange={(url) => setFormData({ ...formData, supportingImageUrl: url })}
                  category="food"
                  helperText="ঐচ্ছিক সাপোর্টিং আইটেমের ছবি (যেমন বোরহানি/সালাদ)।"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">সময়কাল (Seconds)</label>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={formData.slideDurationSeconds}
                      onChange={(e) => setFormData({ ...formData, slideDurationSeconds: parseInt(e.target.value) || 4 })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাজ লেখা</label>
                    <input
                      type="text"
                      value={formData.badgeText}
                      onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                      placeholder="1972"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ক্রমানুসার (Order)</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveHeroSlide"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                  />
                  <label htmlFor="isActiveHeroSlide" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    হিরো স্লাইডারে সক্রিয় রাখুন (Active on Live Hero Banner)
                  </label>
                </div>
              </div>

              {/* Sticky Submit Footer */}
              <div className="p-3.5 sm:p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : editingSlide ? 'আপডেট করুন' : 'যোগ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">হিরো স্লাইড মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-500 mt-1">
                "{deleteCandidate.title}" স্লাইডটি স্থায়ীভাবে মুছে ফেলা হবে এবং হিরো ব্যানার থেকে সরে যাবে।
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                না, রাখুন
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
