'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CustomerReview } from '../../../types';
import { api } from '../../../lib/api';
import ImageUploadField from '../../../components/ImageUploadField';

// Google Colored G Icon
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteCandidate, setDeleteCandidate] = useState<CustomerReview | null>(null);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    avatarUrl: '',
    rating: 5,
    reviewText: '',
    reviewDateText: '1 year ago',
    platform: 'google' as 'google' | 'facebook' | 'direct',
    isVerified: true,
    displayOrder: 0,
    isActive: true,
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/reviews');
      if (res.success && Array.isArray(res.data)) {
        setReviews(res.data);
      }
    } catch (err: any) {
      showToast('error', 'রিভিউ তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({
      customerName: '',
      avatarUrl: '',
      rating: 5,
      reviewText: 'Awesome taste and great traditional hospitality!',
      reviewDateText: '1 week ago',
      platform: 'google',
      isVerified: true,
      displayOrder: reviews.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (review: CustomerReview) => {
    setEditingReview(review);
    setFormData({
      customerName: review.customerName || '',
      avatarUrl: review.avatarUrl || '',
      rating: review.rating || 5,
      reviewText: review.reviewText || '',
      reviewDateText: review.reviewDateText || '1 year ago',
      platform: (review.platform as any) || 'google',
      isVerified: review.isVerified !== false,
      displayOrder: review.displayOrder || 0,
      isActive: review.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.reviewText.trim()) {
      showToast('error', 'গ্রাহকের নাম এবং মন্তব্য উভয়ই পূরণ করুন');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingReview) {
        const res = await api.put(`/admin/reviews/${editingReview._id}`, formData);
        if (res.success) {
          showToast('success', 'রিভিউ সফলভাবে আপডেট হয়েছে');
          setIsModalOpen(false);
          fetchReviews();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gharowa_cms_updated'));
          }
        } else {
          showToast('error', res.message || 'আপডেট করতে সমস্যা হয়েছে');
        }
      } else {
        const res = await api.post('/admin/reviews', formData);
        if (res.success) {
          showToast('success', 'নতুন রিভিউ সফলভাবে যোগ করা হয়েছে');
          setIsModalOpen(false);
          fetchReviews();
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

  const toggleStatus = async (review: CustomerReview) => {
    try {
      const updatedStatus = !review.isActive;
      const res = await api.put(`/admin/reviews/${review._id}`, { isActive: updatedStatus });
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === review._id ? { ...r, isActive: updatedStatus } : r))
        );
        showToast('success', `রিভিউ ${updatedStatus ? 'সক্রিয় (Enabled)' : 'নিষ্ক্রিয় (Disabled)'} করা হয়েছে`);
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
      const res = await api.delete(`/admin/reviews/${deleteCandidate._id}`);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r._id !== deleteCandidate._id));
        showToast('success', 'রিভিউ সফলভাবে মুছে ফেলা হয়েছে');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gharowa_cms_updated'));
        }
      } else {
        showToast('error', res.message || 'মুছে ফেলতে ব্যর্থ');
      }
    } catch (err) {
      showToast('error', 'রিভিউ ডিলিট করতে সমস্যা হয়েছে');
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
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Our Review — Customer Reviews CMS
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                হোমপেজের "Our Review / Customers Loves" সেকশনের গুগল রিভিউ ও রেটিং পরিচালনা করুন
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন রিভিউ যোগ করুন</span>
        </button>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#EA580C] mb-3" />
          <p className="text-sm">রিভিউ তালিকা লোড হচ্ছে...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">কোনো রিভিউ পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            হোমপেজে গ্রাহকদের রিভিউ প্রদর্শন করতে "নতুন রিভিউ যোগ করুন" বাটনে ক্লিক করুন।
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            রিভিউ যোগ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review) => {
            const initial = review.customerName.charAt(0).toUpperCase() || 'U';

            return (
              <div
                key={review._id}
                className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  review.isActive ? 'border-slate-200 shadow-2xs' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
                }`}
              >
                <div>
                  {/* Top Row: Avatar, Name, Platform */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {review.avatarUrl ? (
                        <img
                          src={review.avatarUrl}
                          alt={review.customerName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
                          {initial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {review.customerName}
                        </h4>
                        <p className="text-xs text-slate-400 font-normal">
                          {review.reviewDateText || '1 year ago'}
                        </p>
                      </div>
                    </div>

                    <GoogleIcon />
                  </div>

                  {/* Stars & Verified */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    {review.isVerified !== false && (
                      <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />
                    )}
                    <span className="text-[10px] text-slate-400 font-medium ml-auto">
                      ক্রম: {review.displayOrder}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {review.reviewText}
                  </p>
                </div>

                {/* Actions Row */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleStatus(review)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                      review.isActive
                        ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {review.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{review.isActive ? 'Active' : 'Disabled'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(review)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Edit review"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(review)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#EA580C]" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingReview ? 'রিভিউ সম্পাদনা করুন' : 'নতুন কাস্টমার রিভিউ যুক্ত করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    গ্রাহকের নাম (Customer Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Tanvir Ahmed Shanto"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>

                <ImageUploadField
                  label="প্রোফাইল ছবি (Avatar - ঐচ্ছিক)"
                  value={formData.avatarUrl}
                  onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                  category="general"
                  helperText="Upload From Device অথবা Previous Photo Collection থেকে ছবি সিলেক্ট করুন (খালি রাখলে নামের আদ্যক্ষর দেখাবে)।"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রেটিং (Rating Stars)</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] bg-white"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Star)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Star)</option>
                      <option value={3}>⭐⭐⭐ (3 Star)</option>
                      <option value={2}>⭐⭐ (2 Star)</option>
                      <option value={1}>⭐ (1 Star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ / সময় (Date Text)</label>
                    <input
                      type="text"
                      value={formData.reviewDateText}
                      onChange={(e) => setFormData({ ...formData, reviewDateText: e.target.value })}
                      placeholder="e.g. 1 year ago, 2 weeks ago"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    রিভিউ মন্তব্য (Review Text) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    placeholder="e.g. This user only left a rating / Good / Awesome khichuri!"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">প্ল্যাটফর্ম (Platform)</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] bg-white"
                    >
                      <option value="google">Google Review</option>
                      <option value="facebook">Facebook</option>
                      <option value="direct">Direct Review</option>
                    </select>
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

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isVerifiedRev"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isVerifiedRev" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      যাচাইকৃত ব্যাজ (Verified Badge)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActiveRev"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <label htmlFor="isActiveRev" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      সক্রিয় রাখুন (Active)
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="shrink-0 p-4 sm:px-6 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50">
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
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : editingReview ? 'আপডেট করুন' : 'যোগ করুন'}</span>
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
              <h3 className="text-base font-bold text-slate-900">রিভিউ মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-500 mt-1">
                "{deleteCandidate.customerName}" এর রিভিউটি স্থায়ীভাবে মুছে ফেলা হবে।
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
