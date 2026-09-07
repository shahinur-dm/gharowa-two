'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Play,
  Save,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { BlogVideo } from '../../../types';
import { api } from '../../../lib/api';
import ImageUploadField from '../../../components/ImageUploadField';

export default function AdminBlogsPage() {
  const [videos, setVideos] = useState<BlogVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteCandidate, setDeleteCandidate] = useState<BlogVideo | null>(null);
  const [editingVideo, setEditingVideo] = useState<BlogVideo | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '05:00',
    authorName: 'Gharowa Kitchen',
    displayOrder: 0,
    isActive: true,
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/blogs');
      if (res.success && Array.isArray(res.data)) {
        setVideos(res.data);
      }
    } catch (err: any) {
      showToast('error', 'ভিডিও তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openAddModal = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      titleBn: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '05:00',
      authorName: 'Food Vlogger',
      displayOrder: videos.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (video: BlogVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '',
      titleBn: video.titleBn || '',
      videoUrl: video.videoUrl || '',
      thumbnailUrl: video.thumbnailUrl || '',
      duration: video.duration || '05:00',
      authorName: video.authorName || 'Gharowa Kitchen',
      displayOrder: video.displayOrder || 0,
      isActive: video.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoUrl.trim() || !formData.thumbnailUrl.trim()) {
      showToast('error', 'Video URL এবং Thumbnail URL উভয়ই পূরণ করুন');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingVideo) {
        const res = await api.put(`/admin/blogs/${editingVideo._id}`, formData);
        if (res.success) {
          showToast('success', 'ভিডিও তথ্য সফলভাবে আপডেট হয়েছে');
          setIsModalOpen(false);
          fetchVideos();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gharowa_cms_updated'));
          }
        } else {
          showToast('error', res.message || 'আপডেট করতে সমস্যা হয়েছে');
        }
      } else {
        const res = await api.post('/admin/blogs', formData);
        if (res.success) {
          showToast('success', 'নতুন ভিডিও সফলভাবে যোগ করা হয়েছে');
          setIsModalOpen(false);
          fetchVideos();
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

  const toggleStatus = async (video: BlogVideo) => {
    try {
      const updatedStatus = !video.isActive;
      const res = await api.put(`/admin/blogs/${video._id}`, { isActive: updatedStatus });
      if (res.success) {
        setVideos((prev) =>
          prev.map((v) => (v._id === video._id ? { ...v, isActive: updatedStatus } : v))
        );
        showToast('success', `ভিডিও ${updatedStatus ? 'সক্রিয় (Enabled)' : 'নিষ্ক্রিয় (Disabled)'} করা হয়েছে`);
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
      const res = await api.delete(`/admin/blogs/${deleteCandidate._id}`);
      if (res.success) {
        setVideos((prev) => prev.filter((v) => v._id !== deleteCandidate._id));
        showToast('success', 'ভিডিও সফলভাবে মুছে ফেলা হয়েছে');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gharowa_cms_updated'));
        }
      } else {
        showToast('error', res.message || 'মুছে ফেলতে ব্যর্থ');
      }
    } catch (err) {
      showToast('error', 'ভিডিও ডিলিট করতে সমস্যা হয়েছে');
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
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Our Blog — Video Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                ওয়েবসাইটের হোমপেজের "Our Blog" সেকশনের ভিডিও ও থাম্বনেইল পরিচালনা করুন
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ভিডিও যোগ করুন</span>
        </button>
      </div>

      {/* Videos List Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#EA580C] mb-3" />
          <p className="text-sm">ভিডিও তালিকা লোড হচ্ছে...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">কোনো ব্লগ ভিডিও নেই</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            হোমপেজে ভিডিও প্রদর্শন করতে "নতুন ভিডিও যোগ করুন" বাটনে ক্লিক করে প্রথম ভিডিও যুক্ত করুন।
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            ভিডিও যুক্ত করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <div
              key={video._id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                video.isActive ? 'border-slate-200 shadow-2xs' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/8] bg-slate-900 overflow-hidden group">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <span className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/70 text-white">
                    {video.duration}
                  </span>
                )}

                {/* Order Badge */}
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-slate-800 shadow-xs">
                  ক্রমানুসার: {video.displayOrder}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{video.title}</h3>
                  {video.titleBn && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-bengali">
                      {video.titleBn}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>প্রণেতা:</span>
                    <span className="font-semibold text-slate-600">{video.authorName || 'Gharowa Kitchen'}</span>
                  </p>
                </div>

                {/* Link Preview */}
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#EA580C] hover:underline flex items-center gap-1 truncate"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{video.videoUrl}</span>
                </a>

                {/* Actions Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleStatus(video)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                      video.isActive
                        ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {video.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{video.isActive ? 'Active' : 'Disabled'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(video)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Edit video"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(video)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Delete video"
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

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#EA580C]" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingVideo ? 'ভিডিও সম্পাদনা করুন' : 'নতুন ব্লগ ভিডিও যুক্ত করুন'}
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
            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ভিডিওর শিরোনাম (Title in English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Gharowa Special Mutton Khichuri Review"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিরোনাম (বাংলায় - ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formData.titleBn}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  placeholder="e.g. ঘরোয়ার খাসির ভুনা খিচুড়ি রিভিউ"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] font-bengali"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ভিডিও লিঙ্ক (YouTube / Video URL) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>

              <ImageUploadField
                label="থাম্বনেইল ইমেজ (Thumbnail Image) *"
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                category="food"
                helperText="Upload From Device অথবা Previous Photo Collection থেকে ব্লগ থাম্বনেইল নির্বাচন করুন।"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভিডিওর দৈর্ঘ্য (Duration)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 05:30"
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ফুড ভ্লগার / চ্যানেল নাম (Author Name)
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="e.g. Dhaka Foodies"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveVideo"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                />
                <label htmlFor="isActiveVideo" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  ওয়েবসাইটে সক্রিয় রাখুন (Enable on Live Website)
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
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
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : editingVideo ? 'আপডেট করুন' : 'যোগ করুন'}</span>
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
              <h3 className="text-base font-bold text-slate-900">ভিডিও মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-500 mt-1">
                "{deleteCandidate.title}" ভিডিওটি স্থায়ীভাবে মুছে ফেলা হবে এবং হোমপেজ থেকে সরে যাবে।
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
