'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { BrandPartner } from '../../../types';
import { api } from '../../../lib/api';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandPartner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteCandidate, setDeleteCandidate] = useState<BrandPartner | null>(null);
  const [editingBrand, setEditingBrand] = useState<BrandPartner | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    displayOrder: 0,
    isActive: true,
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/brands');
      if (res.success && Array.isArray(res.data)) {
        setBrands(res.data);
      }
    } catch (err: any) {
      showToast('error', 'ব্র্যান্ড তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      logoUrl: '',
      websiteUrl: '',
      displayOrder: brands.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (brand: BrandPartner) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      logoUrl: brand.logoUrl || '',
      websiteUrl: brand.websiteUrl || '',
      displayOrder: brand.displayOrder || 0,
      isActive: brand.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.logoUrl.trim()) {
      showToast('error', 'ব্র্যান্ডের নাম এবং লোগো লিঙ্ক উভয়ই পূরণ করুন');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingBrand) {
        const res = await api.put(`/admin/brands/${editingBrand._id}`, formData);
        if (res.success) {
          showToast('success', 'ব্র্যান্ড তথ্য সফলভাবে আপডেট হয়েছে');
          setIsModalOpen(false);
          fetchBrands();
        } else {
          showToast('error', res.message || 'আপডেট করতে সমস্যা হয়েছে');
        }
      } else {
        const res = await api.post('/admin/brands', formData);
        if (res.success) {
          showToast('success', 'নতুন ব্র্যান্ড সফলভাবে যোগ করা হয়েছে');
          setIsModalOpen(false);
          fetchBrands();
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

  const toggleStatus = async (brand: BrandPartner) => {
    try {
      const updatedStatus = !brand.isActive;
      const res = await api.put(`/admin/brands/${brand._id}`, { isActive: updatedStatus });
      if (res.success) {
        setBrands((prev) =>
          prev.map((b) => (b._id === brand._id ? { ...b, isActive: updatedStatus } : b))
        );
        showToast('success', `ব্র্যান্ড ${updatedStatus ? 'সক্রিয় (Enabled)' : 'নিষ্ক্রিয় (Disabled)'} করা হয়েছে`);
      }
    } catch (err) {
      showToast('error', 'স্ট্যাটাস পরিবর্তন করা যায়নি');
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      const res = await api.delete(`/admin/brands/${deleteCandidate._id}`);
      if (res.success) {
        setBrands((prev) => prev.filter((b) => b._id !== deleteCandidate._id));
        showToast('success', 'ব্র্যান্ড সফলভাবে মুছে ফেলা হয়েছে');
      } else {
        showToast('error', res.message || 'মুছে ফেলতে ব্যর্থ');
      }
    } catch (err) {
      showToast('error', 'ব্র্যান্ড ডিলিট করতে সমস্যা হয়েছে');
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
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Trusted by Leading Brands — CMS
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                হোমপেজের "Trusted by Leading Brands" সেকশনের কর্পোরেট ও ব্র্যান্ড পার্টনার লোগো পরিচালনা করুন
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্র্যান্ড যোগ করুন</span>
        </button>
      </div>

      {/* Brands List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#EA580C] mb-3" />
          <p className="text-sm">ব্র্যান্ড তালিকা লোড হচ্ছে...</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">কোনো ব্র্যান্ড যুক্ত করা নেই</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            হোমপেজে ব্র্যান্ড লোগো প্রদর্শন করতে "নতুন ব্র্যান্ড যোগ করুন" বাটনে ক্লিক করুন।
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            ব্র্যান্ড যোগ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                brand.isActive ? 'border-slate-200 shadow-2xs' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Logo Preview Area */}
                <div className="w-full h-24 rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-center mb-3">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Brand Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{brand.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                      ক্রম: {brand.displayOrder}
                    </span>
                  </div>

                  {brand.websiteUrl && (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#EA580C] hover:underline flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{brand.websiteUrl}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Actions Row */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => toggleStatus(brand)}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                    brand.isActive
                      ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {brand.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{brand.isActive ? 'Active' : 'Disabled'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(brand)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Edit brand"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(brand)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete brand"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#EA580C]" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingBrand ? 'ব্র্যান্ড সম্পাদনা করুন' : 'নতুন ব্র্যান্ড যুক্ত করুন'}
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
                  ব্র্যান্ডের নাম (Brand / Company Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ACI Pharmaceuticals / ACME"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ব্র্যান্ডের লোগো লিঙ্ক (Logo Image URL) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://... direct logo image url"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
                {formData.logoUrl && (
                  <div className="mt-2 w-full h-20 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center">
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ওয়েবসাইট লিঙ্ক (Website URL - ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://www.company.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্রমানুসার (Order)</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActiveBrand"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <label htmlFor="isActiveBrand" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      সক্রিয় রাখুন (Active)
                    </label>
                  </div>
                </div>
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
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : editingBrand ? 'আপডেট করুন' : 'যোগ করুন'}</span>
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
              <h3 className="text-base font-bold text-slate-900">ব্র্যান্ড মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-500 mt-1">
                "{deleteCandidate.name}" ব্র্যান্ডটি স্থায়ীভাবে মুছে ফেলা হবে।
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
