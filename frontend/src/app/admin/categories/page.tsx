'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Boxes,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Eye,
  EyeOff,
  Flame,
  Utensils,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { MenuCategory } from '../../../types';
import ImageUploadField from '../../../components/ImageUploadField';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    slug: '',
    descriptionBn: '',
    descriptionEn: '',
    image: '',
    icon: 'Utensils',
    displayOrder: 0,
    isActive: true,
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/menu/admin/categories');
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (e: any) {
      console.warn('Error fetching categories', e);
      showToast('error', 'ক্যাটাগরি তালিকা লোড হতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      nameBn: '',
      nameEn: '',
      slug: '',
      descriptionBn: '',
      descriptionEn: '',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      icon: 'Utensils',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: MenuCategory) => {
    setEditingCat(cat);
    setFormData({
      nameBn: cat.nameBn,
      nameEn: cat.nameEn,
      slug: cat.slug,
      descriptionBn: cat.descriptionBn || '',
      descriptionEn: cat.descriptionEn || '',
      image: cat.image || '',
      icon: cat.icon || 'Utensils',
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameBn.trim() || !formData.nameEn.trim()) {
      showToast('error', 'বাংলা ও ইংরেজি ক্যাটাগরির নাম প্রদান করুন');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        slug: formData.slug || formData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayOrder: Number(formData.displayOrder) || 1,
      };

      if (editingCat) {
        const res: any = await api.put(`/menu/admin/categories/${editingCat._id}`, payload);
        if (res.success && res.data) {
          setCategories((prev) => prev.map((c) => (c._id === editingCat._id ? res.data : c)));
          setIsModalOpen(false);
          showToast('success', `"${payload.nameBn}" ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে`);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gharowa_cms_updated'));
          }
        } else {
          showToast('error', res.message || 'ক্যাটাগরি আপডেট ব্যর্থ হয়েছে');
        }
      } else {
        const res: any = await api.post('/menu/admin/categories', payload);
        if (res.success && res.data) {
          setCategories((prev) => [...prev, res.data]);
          setIsModalOpen(false);
          showToast('success', `"${payload.nameBn}" নতুন ক্যাটাগরি সফলভাবে তৈরি হয়েছে`);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gharowa_cms_updated'));
          }
        } else {
          showToast('error', res.message || 'ক্যাটাগরি তৈরি ব্যর্থ হয়েছে');
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'ক্যাটাগরি সংরক্ষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (cat: MenuCategory) => {
    try {
      const newStatus = !cat.isActive;
      const res: any = await api.put(`/menu/admin/categories/${cat._id}`, {
        ...cat,
        isActive: newStatus,
      });
      if (res.success) {
        setCategories((prev) =>
          prev.map((c) => (c._id === cat._id ? { ...c, isActive: newStatus } : c))
        );
        showToast('success', `স্ট্যাটাস পরিবর্তন করা হয়েছে`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gharowa_cms_updated'));
        }
      }
    } catch (e: any) {
      showToast('error', 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে');
    }
  };

  const handleDelete = async (cat: MenuCategory) => {
    if (!confirm(`আপনি কি "${cat.nameBn}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) return;
    try {
      const res: any = await api.delete(`/menu/admin/categories/${cat._id}`);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c._id !== cat._id));
        showToast('success', `"${cat.nameBn}" ক্যাটাগরি মুছে ফেলা হয়েছে`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gharowa_cms_updated'));
        }
      }
    } catch (e: any) {
      showToast('error', e.message || 'মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase();
    return c.nameBn.includes(q) || c.nameEn.toLowerCase().includes(q) || c.slug.includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium animate-in fade-in slide-in-from-top-4 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <Layers className="w-5 h-5 text-[#900C19]" />
            <span>Category Management (খাবারের ক্যাটাগরি ব্যবস্থাপনা)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            খিচুড়ি, বিরিয়ানি, নাস্তা, মাছ, কাবাব ইত্যাদি ক্যাটাগরি যোগ, সম্পাদনা ও সাজান
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={fetchCategories}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ক্যাটাগরি যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ক্যাটাগরির নাম বা স্লাগ দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#900C19] focus:bg-white transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 font-mono">
          মোট ক্যাটাগরি: <span className="font-semibold text-slate-900">{filteredCategories.length}</span> টি
        </div>
      </div>

      {/* Categories Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6 w-16 text-center">ক্রম</th>
                <th className="py-3.5 px-4 sm:px-6">ক্যাটাগরি ছবি ও নাম</th>
                <th className="py-3.5 px-4 sm:px-6">URL স্লাগ</th>
                <th className="py-3.5 px-4 sm:px-6">বিবরণ</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-slate-300 border-t-[#900C19] rounded-full animate-spin mx-auto mb-2" />
                    <span>ক্যাটাগরি লোড হচ্ছে...</span>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোনো ক্যাটাগরি পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr key={cat._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Display Order */}
                    <td className="py-3.5 px-4 sm:px-6 text-center font-mono font-medium text-slate-500">
                      {cat.displayOrder || idx + 1}
                    </td>

                    {/* Image & Name */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                          <Image
                            src={
                              cat.image ||
                              'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop'
                            }
                            alt={cat.nameEn}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm font-bengali">
                            {cat.nameBn}
                          </div>
                          <div className="text-[11px] text-slate-500 font-sans">{cat.nameEn}</div>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-[11px] text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {cat.slug}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500 text-[11px] max-w-xs truncate font-bengali">
                      {cat.descriptionBn || cat.descriptionEn || '—'}
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          cat.isActive !== false
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {cat.isActive !== false ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>সক্রিয় (Active)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>নিষ্ক্রিয়</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 bg-slate-50/50 shrink-0">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#900C19]" />
                <span>{editingCat ? 'ক্যাটাগরি সম্পাদনা করুন' : 'নতুন ক্যাটাগরি যোগ করুন'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 text-xs">
              <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      ক্যাটাগরির নাম (বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameBn}
                      onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                      placeholder="যেমন: খিচুড়ি ও বিরিয়ানি"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Category Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="e.g. Khichuri & Biryani"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      URL স্লাগ (Slug)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="যেমন: khichuri-biryani"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      ক্রম সংখ্যা (Display Order)
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    সংক্ষিপ্ত বিবরণ (বাংলা)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionBn}
                    onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                    placeholder="ক্যাটাগরির খাবারের বিশেষত্ব..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                {/* Image Upload Component */}
                <ImageUploadField
                  label="ক্যাটাগরি কভার ছবি (Image URL বা ফাইল আপলোড)"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  helperText="ব্যানার সাইজ ছবি আপলোড করুন"
                />

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="catActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#900C19] rounded border-slate-300 focus:ring-[#900C19]"
                  />
                  <label htmlFor="catActive" className="text-slate-700 font-medium cursor-pointer">
                    ওয়েবসাইটে সক্রিয় রাখুন (Active on Website)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 p-4 sm:px-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-medium shadow-2xs transition-all flex items-center gap-1.5"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCat ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
