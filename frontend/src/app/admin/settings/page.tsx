'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Sparkles,
  Loader2,
  Flame,
  Award,
  User,
  Info,
  Layers,
  FileText,
  Eye,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { RestaurantSettings } from '../../../types';
import ImageUploadField from '../../../components/ImageUploadField';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'chef_owner' | 'general' | 'menu_board'>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res: any = await api.get('/settings');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (e) {
        console.warn('Settings fetch error', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);
      const res: any = await api.put('/settings', settings);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return <div className="p-8 text-center text-xs text-gray-400">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Website CMS & Restaurant Configuration</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            হিরো সেকশন, শেফ, কর্ণধার, আবাউট গল্প, মেনু বোর্ড ও যোগাযোগ সেটিংস পরিবর্তন করুন
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'hero'
              ? 'bg-[#900C19] text-white shadow-md'
              : 'bg-slate-900 text-gray-400 hover:text-white border border-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-300" />
          <span>Hero & Animation CMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'about'
              ? 'bg-[#900C19] text-white shadow-md'
              : 'bg-slate-900 text-gray-400 hover:text-white border border-slate-800'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-amber-300" />
          <span>About Us CMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chef_owner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'chef_owner'
              ? 'bg-[#900C19] text-white shadow-md'
              : 'bg-slate-900 text-gray-400 hover:text-white border border-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>Chef & Owner CMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('menu_board')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'menu_board'
              ? 'bg-[#900C19] text-white shadow-md'
              : 'bg-slate-900 text-gray-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-300" />
          <span>Menu Board Image CMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'bg-[#900C19] text-white shadow-md'
              : 'bg-slate-900 text-gray-400 hover:text-white border border-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-amber-300" />
          <span>General & Contact</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: HERO CMS */}
        {activeTab === 'hero' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Hero Section Content & Animation Assets</span>
            </h3>

            {/* Images: Main & Pouring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadField
                label="Hero Main Dish Image (প্রধান খাবারের ছবি)"
                value={settings.heroImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, heroImageUrl: url })}
                helperText="Mutton Khichuri serving bowl main picture."
              />

              <ImageUploadField
                label="Hero Pouring Pot Asset (ঢালার পাত্রের ছবি)"
                value={settings.heroPouringImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, heroPouringImageUrl: url })}
                helperText="Serving pot pouring layer image for 2D animation."
              />
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Hero Title (Bangla)
                </label>
                <input
                  type="text"
                  value={settings.heroTitleBn || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitleBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Hero Title (English)
                </label>
                <input
                  type="text"
                  value={settings.heroTitleEn || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Hero Subtitle (Bangla)
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitleBn || ''}
                  onChange={(e) => setSettings({ ...settings, heroSubtitleBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Hero Subtitle (English)
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitleEn || ''}
                  onChange={(e) => setSettings({ ...settings, heroSubtitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Badge & CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Badge Text (e.g. AUTHENTIC)
                </label>
                <input
                  type="text"
                  value={settings.heroBadgeEn || ''}
                  onChange={(e) => setSettings({ ...settings, heroBadgeEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Button Text (e.g. Order Now)
                </label>
                <input
                  type="text"
                  value={settings.heroCtaTextEn || ''}
                  onChange={(e) => setSettings({ ...settings, heroCtaTextEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Button Link (e.g. /menu)
                </label>
                <input
                  type="text"
                  value={settings.heroCtaLink || '/menu'}
                  onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT US CMS */}
        {activeTab === 'about' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Info className="w-4 h-4 text-amber-400" />
              <span>About Us Story & Statistics</span>
            </h3>

            <ImageUploadField
              label="About Us Photo (রেস্তোরাঁর ভেতরের পরিবেশের ছবি)"
              value={settings.aboutImageUrl || ''}
              onChange={(url) => setSettings({ ...settings, aboutImageUrl: url })}
              helperText="Dining interior or kitchen heritage image."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">Heading (Bangla)</label>
                <input
                  type="text"
                  value={settings.aboutTitleBn || ''}
                  onChange={(e) => setSettings({ ...settings, aboutTitleBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Heading (English)</label>
                <input
                  type="text"
                  value={settings.aboutTitleEn || ''}
                  onChange={(e) => setSettings({ ...settings, aboutTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-300 mb-1">Story Description (English)</label>
                <textarea
                  rows={3}
                  value={settings.aboutDescEn || ''}
                  onChange={(e) => setSettings({ ...settings, aboutDescEn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-300 mb-1">Story Description (Bangla)</label>
                <textarea
                  rows={3}
                  value={settings.aboutDescBn || ''}
                  onChange={(e) => setSettings({ ...settings, aboutDescBn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHEF & OWNER CMS */}
        {activeTab === 'chef_owner' && (
          <div className="space-y-6">
            {/* Chef Profile */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Meet Our Chef Configuration</span>
              </h3>

              <ImageUploadField
                label="Chef Photo"
                value={settings.chefImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, chefImageUrl: url })}
                helperText="Upload or enter photo URL of the Executive Chef."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Chef Name</label>
                  <input
                    type="text"
                    value={settings.chefName || ''}
                    onChange={(e) => setSettings({ ...settings, chefName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={settings.chefDesignation || ''}
                    onChange={(e) => setSettings({ ...settings, chefDesignation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={settings.chefSpecialty || ''}
                    onChange={(e) => setSettings({ ...settings, chefSpecialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-gray-300 mb-1">Chef Biography (Bangla/English)</label>
                  <textarea
                    rows={2}
                    value={settings.chefBioEn || ''}
                    onChange={(e) => setSettings({ ...settings, chefBioEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Owner Profile */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <User className="w-4 h-4 text-amber-400" />
                <span>Meet Our Owner Configuration</span>
              </h3>

              <ImageUploadField
                label="Owner Photo"
                value={settings.ownerImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, ownerImageUrl: url })}
                helperText="Upload or enter photo URL of the Founder & Owner."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={settings.ownerName || ''}
                    onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={settings.ownerDesignation || ''}
                    onChange={(e) => setSettings({ ...settings, ownerDesignation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-300 mb-1">Owner Quote / Philosophy</label>
                  <input
                    type="text"
                    value={settings.ownerQuoteEn || ''}
                    onChange={(e) => setSettings({ ...settings, ownerQuoteEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MENU BOARD IMAGE CMS */}
        {activeTab === 'menu_board' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Restaurant Menu Board / Price List Image (খাবারের মূল্য তালিকা বোর্ড)</span>
              </h3>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={settings.isMenuBoardEnabled ?? true}
                  onChange={(e) => setSettings({ ...settings, isMenuBoardEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span className="text-gray-300 font-semibold">মেনু পেজে বোর্ড বাটন সক্রিয় রাখুন</span>
              </label>
            </div>

            <p className="text-xs text-gray-400">
              রেস্তোরাঁর ফিজিক্যাল মেনু বোর্ডের ছবি (যেমন: কালো ও সোনালী মূল্য তালিকা বোর্ড) আপলোড করতে পারেন। মেনু পেজে গ্রাহকরা ইচ্ছা করলে মূল বোর্ড ছবি প্রিভিউ দেখতে পারবেন।
            </p>

            <ImageUploadField
              label="Menu Board Image (মূল্য তালিকা বোর্ডের ছবি আপলোড করুন)"
              value={settings.menuBoardImageUrl || ''}
              onChange={(url) => setSettings({ ...settings, menuBoardImageUrl: url })}
              helperText="Upload official physical menu board photo or enter URL."
            />
          </div>
        )}

        {/* TAB 5: GENERAL & CONTACT SETTINGS */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Phone & WhatsApp */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Contact & Hotline</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">হটলাইন ফোন নম্বর</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">
                    WhatsApp অর্ডার গ্রহণকারী নম্বর (880XXXXXXXXXX)
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Limits */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Delivery & Limits</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">
                    স্ট্যান্ডার্ড ডেলিভারি ফি (BDT)
                  </label>
                  <input
                    type="number"
                    value={settings.standardDeliveryFee}
                    onChange={(e) =>
                      setSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">
                    ফ্রি ডেলিভারি থ্রেশহোল্ড (BDT)
                  </label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">
                    ন্যূনতম অর্ডারের পরিমাণ (BDT)
                  </label>
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) =>
                      setSettings({ ...settings, minOrderAmount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Address & Opening Hours</span>
              </h3>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">ঠিকানা (বাংলা)</label>
                <input
                  type="text"
                  value={settings.addressBn}
                  onChange={(e) => setSettings({ ...settings, addressBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">খোলার সময়</label>
                <input
                  type="text"
                  value={settings.openingHoursBn}
                  onChange={(e) => setSettings({ ...settings, openingHoursBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 rounded-2xl bg-[#900C19] hover:bg-[#780813] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-red transition-all"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>সংরক্ষণ করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>সেটিংস আপডেট সংরক্ষণ করুন (Save CMS Changes)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
