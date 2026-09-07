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
  Award,
  User,
  Info,
  Globe,
  Share2,
  FileText,
  Image as ImageIcon,
  Flame,
  Eye,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { RestaurantSettings } from '../../../types';
import ImageUploadField from '../../../components/ImageUploadField';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [activeTab, setActiveTab] = useState<
    'branding' | 'hero' | 'popular' | 'about' | 'chef_owner' | 'contact' | 'whatsapp' | 'footer' | 'general' | 'seo'
  >('branding');
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

  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setErrorMessage('');
      const res: any = await api.put('/settings', settings);
      if (res.success) {
        setSaveSuccess(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gharowa_cms_updated'));
        }
        setTimeout(() => setSaveSuccess(false), 5000);
      } else {
        setErrorMessage(res.message || 'Database update failed');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('413')) {
        setErrorMessage('ছবির আকার সীমা অতিক্রম করেছে। ডিভাইস থেকে নতুন করে ছবি নির্বাচন করুন, এটি স্বয়ংক্রিয়ভাবে সংকুচিত হবে।');
      } else {
        setErrorMessage(err.message || 'Unable to update database right now');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 font-normal">
        লোড হচ্ছে...
      </div>
    );
  }

  const tabs = [
    { id: 'branding', label: 'Branding & Logo', icon: ImageIcon },
    { id: 'hero', label: 'Hero & Banner', icon: Sparkles },
    { id: 'popular', label: 'Popular Dishes', icon: Flame },
    { id: 'about', label: 'About Us & Story', icon: Info },
    { id: 'chef_owner', label: 'Chef & Owner', icon: Award },
    { id: 'contact', label: 'Contact & Location', icon: MapPin },
    { id: 'whatsapp', label: 'WhatsApp Orders', icon: MessageCircle },
    { id: 'footer', label: 'Footer & Socials', icon: Share2 },
    { id: 'general', label: 'General & Delivery', icon: Settings },
    { id: 'seo', label: 'SEO & OpenGraph', icon: Globe },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      {/* Header with Live Status & View Live Website */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <Settings className="w-5 h-5 text-[#900C19]" />
            <span>Website CMS & Business Management (ওয়েবসাইট কন্ট্রোল)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            লোগো, হিরো ব্যানার, শেফ, কর্ণধার, আবাউট গল্প, যোগাযোগ ও এসইও নিয়ন্ত্রণ কেন্দ্র
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✓ Saved to Database • Public Website Sync Ready</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200 animate-in fade-in">
              <span>✕ {errorMessage}</span>
            </div>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#900C19] hover:bg-[#780813] text-white text-xs font-medium transition-all shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>লাইভ ওয়েবসাইট দেখুন (View Live)</span>
          </a>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#900C19] text-white font-semibold shadow-2xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ==================== TAB 0: BRANDING & LOGO ==================== */}
        {activeTab === 'branding' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#900C19]" />
                  <span>Restaurant Logo & Visual Branding</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  ওয়েবসাইটের হেডার, ফুটার এবং অ্যাডমিন প্যানেলে প্রদর্শিত অফিসিয়াল লোগো
                </p>
              </div>
            </div>

            {/* Live Logo Preview Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-amber-400/80 p-1 flex items-center justify-center shrink-0 shadow-md">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-contain rounded-full"
                    />
                  ) : (
                    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                      <path d="M 100 24 L 176 86 L 156 86 L 156 148 L 44 148 L 44 86 L 24 86 Z" fill="#D92027" stroke="#0F172A" strokeWidth="4" />
                      <rect x="56" y="98" width="30" height="50" fill="#900C19" stroke="white" strokeWidth="2" />
                      <rect x="98" y="104" width="46" height="32" fill="#900C19" stroke="white" strokeWidth="2" />
                      <text x="102" y="128" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif">GH</text>
                      <rect x="18" y="146" width="164" height="28" fill="#036937" stroke="white" strokeWidth="3" rx="2" />
                      <text x="30" y="166" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="2">GHAROWA</text>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {settings.logoUrl ? 'Custom Uploaded Logo (কাস্টম লোগো সক্রিয়)' : 'Default Authentic Gharowa Logo (ডিফল্ট লোগো)'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    হেডার, ফুটার এবং ওয়েবসাইটের সকল স্থানে এই লোগোটি রিয়েল-টাইমে প্রদর্শিত হবে।
                  </p>
                </div>
              </div>

              {settings.logoUrl && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoUrl: '' })}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium border border-rose-200 transition-colors"
                >
                  ডিফল্ট লোগো পুনরুদ্ধার করুন (Restore Default)
                </button>
              )}
            </div>

            {/* Logo Upload Field */}
            <ImageUploadField
              label="Upload / Replace Official Logo (লোগো ফাইল আপলোড বা URL)"
              value={settings.logoUrl || ''}
              onChange={(url) => setSettings({ ...settings, logoUrl: url })}
              helperText="Upload PNG, SVG, or high quality JPG logo image. Leave blank to use original Gharowa emblem."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
              <div>
                <label className="block font-medium text-slate-700 mb-1">রেস্তোরাঁর নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={settings.restaurantNameBn || ''}
                  onChange={(e) => setSettings({ ...settings, restaurantNameBn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Restaurant Name (English) *</label>
                <input
                  type="text"
                  value={settings.restaurantNameEn || ''}
                  onChange={(e) => setSettings({ ...settings, restaurantNameEn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">প্রতিষ্ঠার সাল (Established Year)</label>
                <input
                  type="number"
                  value={settings.establishedYear || 1972}
                  onChange={(e) => setSettings({ ...settings, establishedYear: parseInt(e.target.value) || 1972 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ট্যাগলাইন (বাংলা)</label>
                <input
                  type="text"
                  value={settings.taglineBn || ''}
                  onChange={(e) => setSettings({ ...settings, taglineBn: e.target.value })}
                  placeholder="১৯৭২ থেকে ঢাকার হৃদয়ে ঐতিহ্যের স্বাদ"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 1: HERO CMS ==================== */}
        {activeTab === 'hero' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#900C19]" />
                <span>Homepage Hero Banner & Visual Assets</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                মূল হোমপেজ ব্যানারের শিরোনাম, ট্যাগলাইন, বোতাম এবং ছবির ফাইলসমূহ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  হিরো শিরোনাম (বাংলা) *
                </label>
                <input
                  type="text"
                  value={settings.heroTitleBn || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitleBn: e.target.value })}
                  placeholder="ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Hero Title (English) *
                </label>
                <input
                  type="text"
                  value={settings.heroTitleEn || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitleEn: e.target.value })}
                  placeholder="MUTTON KHICHURI"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  হিরো সাবটাইটেল (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitleBn || ''}
                  onChange={(e) => setSettings({ ...settings, heroSubtitleBn: e.target.value })}
                  placeholder="আসল স্বাদ, মোহময় সুবাস ও নিপুণভাবে রান্না করা খাসির নরম মাংস।"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Hero Subtitle (English)
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitleEn || ''}
                  onChange={(e) => setSettings({ ...settings, heroSubtitleEn: e.target.value })}
                  placeholder="Traditional taste, rich aroma and perfectly cooked mutton."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ব্যাজ টেক্সট (বাংলা)
                </label>
                <input
                  type="text"
                  value={settings.heroBadgeBn || ''}
                  onChange={(e) => setSettings({ ...settings, heroBadgeBn: e.target.value })}
                  placeholder="খাঁটি ও ঐতিহ্যবাহী"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Badge Text (English)
                </label>
                <input
                  type="text"
                  value={settings.heroBadgeEn || ''}
                  onChange={(e) => setSettings({ ...settings, heroBadgeEn: e.target.value })}
                  placeholder="AUTHENTIC"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  CTA বোতাম টেক্সট (বাংলা)
                </label>
                <input
                  type="text"
                  value={settings.heroCtaTextBn || ''}
                  onChange={(e) => setSettings({ ...settings, heroCtaTextBn: e.target.value })}
                  placeholder="অর্ডার করুন"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  CTA Button Text (English)
                </label>
                <input
                  type="text"
                  value={settings.heroCtaTextEn || ''}
                  onChange={(e) => setSettings({ ...settings, heroCtaTextEn: e.target.value })}
                  placeholder="Order Now"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <ImageUploadField
                label="Hero Signature Dish Image (প্রধান খাবারের ছবি)"
                value={settings.heroImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, heroImageUrl: url })}
                helperText="Upload your signature Mutton Khichuri dish image."
              />

              <ImageUploadField
                label="Hero Sauce / Pouring Image (সুস্বাদু গ্রেভি বা পরিবেশন ছবি)"
                value={settings.heroPouringImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, heroPouringImageUrl: url })}
                helperText="Secondary garnish / gravy image displayed with dynamic visual effect."
              />
            </div>
          </div>
        )}

        {/* ==================== TAB 2: POPULAR DISHES ==================== */}
        {activeTab === 'popular' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#900C19]" />
                <span>Popular Dishes Section Settings</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                জনপ্রিয় খাবার সেকশনের শিরোনাম, সাবটাইটেল এবং ডিসপ্লে নিয়ন্ত্রণ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">সেকশন শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={settings.popularDishesTitleBn || ''}
                  onChange={(e) => setSettings({ ...settings, popularDishesTitleBn: e.target.value })}
                  placeholder="ঘরোয়ার সবচেয়ে জনপ্রিয় খাবার"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Section Title (English)</label>
                <input
                  type="text"
                  value={settings.popularDishesTitleEn || ''}
                  onChange={(e) => setSettings({ ...settings, popularDishesTitleEn: e.target.value })}
                  placeholder="Most Popular Dishes"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">সাবটাইটেল (বাংলা)</label>
                <textarea
                  rows={2}
                  value={settings.popularDishesSubtitleBn || ''}
                  onChange={(e) => setSettings({ ...settings, popularDishesSubtitleBn: e.target.value })}
                  placeholder="প্রতিদিন শত শত ভোজনরসিকের প্রথম পছন্দ মতিঝিলের ঐতিহ্যবাহী স্পেশাল আইটেম"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Subtitle (English)</label>
                <textarea
                  rows={2}
                  value={settings.popularDishesSubtitleEn || ''}
                  onChange={(e) => setSettings({ ...settings, popularDishesSubtitleEn: e.target.value })}
                  placeholder="Our daily signature dishes crafted with traditional spice blends"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium text-xs">
                <input
                  type="checkbox"
                  checked={settings.isPopularDishesEnabled !== false}
                  onChange={(e) => setSettings({ ...settings, isPopularDishesEnabled: e.target.checked })}
                  className="rounded text-[#900C19] focus:ring-[#900C19]"
                />
                <span>Enable Popular Dishes Section on Homepage</span>
              </label>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: ABOUT US ==================== */}
        {activeTab === 'about' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#900C19]" />
                <span>About Us & Heritage Story Configuration</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ঘরোয়ার ৫০+ বছরের ঐতিহ্যের গল্প ও স্ট্যাটিস্টিক্স
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={settings.aboutTitleBn || ''}
                  onChange={(e) => setSettings({ ...settings, aboutTitleBn: e.target.value })}
                  placeholder="আমাদের গল্প"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  value={settings.aboutTitleEn || ''}
                  onChange={(e) => setSettings({ ...settings, aboutTitleEn: e.target.value })}
                  placeholder="Our Story"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ঐতিহ্যের বিবরণ (বাংলা)</label>
                <textarea
                  rows={4}
                  value={settings.aboutDescBn || ''}
                  onChange={(e) => setSettings({ ...settings, aboutDescBn: e.target.value })}
                  placeholder="১৯৭২ সাল থেকে ঢাকার মতিঝিলের প্রাণকেন্দ্রে খাঁটি ঐতিহ্যবাহী স্বাদের বিশ্বস্ত ঠিকানা..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Story Description (English)</label>
                <textarea
                  rows={4}
                  value={settings.aboutDescEn || ''}
                  onChange={(e) => setSettings({ ...settings, aboutDescEn: e.target.value })}
                  placeholder="Gharowa Hotel & Restaurant started in 1972 with a simple goal..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>
            </div>

            <ImageUploadField
              label="About Us Section Photo (রেস্টুরেন্টের ঐতিহাসিক বা ডাইনিং ছবি)"
              value={settings.aboutImageUrl || ''}
              onChange={(url) => setSettings({ ...settings, aboutImageUrl: url })}
            />
          </div>
        )}

        {/* ==================== TAB 4: CHEF & OWNER ==================== */}
        {activeTab === 'chef_owner' && (
          <div className="space-y-6">
            {/* Master Chef */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#900C19]" />
                  <span>Master Chef Information (প্রধান শেফ পরিচিতি)</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">শেফের নাম (Chef Name)</label>
                  <input
                    type="text"
                    value={settings.chefName || ''}
                    onChange={(e) => setSettings({ ...settings, chefName: e.target.value })}
                    placeholder="Chef Rahman"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">পদবী (Designation)</label>
                  <input
                    type="text"
                    value={settings.chefDesignation || ''}
                    onChange={(e) => setSettings({ ...settings, chefDesignation: e.target.value })}
                    placeholder="Executive Master Chef"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">অভিজ্ঞতা (Experience)</label>
                  <input
                    type="text"
                    value={settings.chefExperience || ''}
                    onChange={(e) => setSettings({ ...settings, chefExperience: e.target.value })}
                    placeholder="25+ Years Experience"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">বিশেষত্ব (Specialty)</label>
                  <input
                    type="text"
                    value={settings.chefSpecialty || ''}
                    onChange={(e) => setSettings({ ...settings, chefSpecialty: e.target.value })}
                    placeholder="Dum Pukht & Heritage Khichuri"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">শেফের জীবনী / বার্তা (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={settings.chefBioBn || ''}
                    onChange={(e) => setSettings({ ...settings, chefBioBn: e.target.value })}
                    placeholder="২৫ বছরেরও বেশি রন্ধন অভিজ্ঞতায় ঐতিহ্যবাহী মসলা ও খাঁটি ঘরোয়া স্বাদের ধারক..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Chef Photo (প্রধান শেফের ছবি)"
                value={settings.chefImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, chefImageUrl: url })}
              />
            </div>

            {/* Founder / Owner */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#900C19]" />
                  <span>Founder & Leadership (প্রতিষ্ঠাতা ও কর্ণধার)</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">প্রতিষ্ঠাতার নাম (Owner Name)</label>
                  <input
                    type="text"
                    value={settings.ownerName || ''}
                    onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                    placeholder="Alhaj Md. Sirajuddin"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">পদবী (Designation)</label>
                  <input
                    type="text"
                    value={settings.ownerDesignation || ''}
                    onChange={(e) => setSettings({ ...settings, ownerDesignation: e.target.value })}
                    placeholder="Founder & Visionary"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">প্রতিষ্ঠাতার উক্তি (Quote / Message)</label>
                  <input
                    type="text"
                    value={settings.ownerQuoteBn || ''}
                    onChange={(e) => setSettings({ ...settings, ownerQuoteBn: e.target.value })}
                    placeholder="স্বাদ যেখানে স্মৃতি, তৃপ্তি যেখানে প্রতিশ্রুতি।"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Founder Photo (প্রতিষ্ঠাতা / কর্ণধারের ছবি)"
                value={settings.ownerImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, ownerImageUrl: url })}
              />
            </div>
          </div>
        )}

        {/* ==================== TAB 5: CONTACT & LOCATION ==================== */}
        {activeTab === 'contact' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#900C19]" />
                <span>Restaurant Location, Hotline & Operating Hours</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                মতিঝিল রেস্টুরেন্টের সঠিক ঠিকানা, হটলাইন ও গুগল ম্যাপ লিংক
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">সরাসরি ফোন নম্বর (Phone) *</label>
                <input
                  type="text"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="01973255888"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">WhatsApp নম্বর (International format) *</label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="8801973255888"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ইমেইল এড্রেস (Email)</label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="info@gharowarestaurant.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">গুগল ম্যাপ ইউআরএল (Google Maps Link)</label>
                <input
                  type="url"
                  value={settings.googleMapsUrl || ''}
                  onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">রেস্টুরেন্টের ঠিকানা (বাংলা)</label>
                <input
                  type="text"
                  value={settings.addressBn || ''}
                  onChange={(e) => setSettings({ ...settings, addressBn: e.target.value })}
                  placeholder="৯/সি মতিঝিল বা/এ, ঢাকা-১০০০"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Restaurant Address (English)</label>
                <input
                  type="text"
                  value={settings.addressEn || ''}
                  onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
                  placeholder="9/C Motijheel C/A, Dhaka-1000"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ল্যান্ডমার্ক বিবরণ (বাংলা)</label>
                <input
                  type="text"
                  value={settings.landmarkBn || ''}
                  onChange={(e) => setSettings({ ...settings, landmarkBn: e.target.value })}
                  placeholder="মতিঝিল মেট্রোরেল স্টেশন ও শাপলা চত্বরের সংলগ্ন"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">খোলা থাকার সময়সূচি (বাংলা)</label>
                <input
                  type="text"
                  value={settings.openingHoursBn || ''}
                  onChange={(e) => setSettings({ ...settings, openingHoursBn: e.target.value })}
                  placeholder="সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: WHATSAPP ORDERS ==================== */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#900C19]" />
                <span>WhatsApp Direct Ordering Engine Settings</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                গ্রাহক যখন খাবারের পেজে [ Order Now on WhatsApp ] ক্লিক করবেন, তখন ব্যবহৃত নম্বর ও মেসেজ টেমপ্লেট
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">WhatsApp Business Number (বিনা প্লাস/কোড) *</label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="8801973255888"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#900C19]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">উদা: 8801973255888 (আন্তর্জাতিক ফরম্যাট)</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Country Dial Code (কান্ট্রি কোড)</label>
                <input
                  type="text"
                  value={settings.whatsappCountryCode || '+880'}
                  onChange={(e) => setSettings({ ...settings, whatsappCountryCode: e.target.value })}
                  placeholder="+880"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  WhatsApp Order Message Template (অর্ডার বার্তা টেমপ্লেট)
                </label>
                <textarea
                  rows={6}
                  value={
                    settings.whatsappOrderTemplate ||
                    `Hello Gharowa Hotel & Restaurant (Since 1972),\n\nI would like to place an order from your website:\n\n🍛 Food: {{product_name}}\n🔢 Quantity: {{quantity}}\n💰 Price: {{price}}\n💵 Total: {{total}}\n\nPlease confirm availability and delivery details. Thank you!`
                  }
                  onChange={(e) => setSettings({ ...settings, whatsappOrderTemplate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#900C19]"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                  <span className="font-semibold">ব্যবহারযোগ্য ভ্যারিয়েবল:</span>
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-700">{'{{product_name}}'}</code>
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-700">{'{{quantity}}'}</code>
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-700">{'{{price}}'}</code>
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-700">{'{{total}}'}</code>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium text-xs">
                <input
                  type="checkbox"
                  checked={settings.isWhatsAppOrderActive !== false}
                  onChange={(e) => setSettings({ ...settings, isWhatsAppOrderActive: e.target.checked })}
                  className="rounded text-[#900C19] focus:ring-[#900C19]"
                />
                <span>Enable WhatsApp 1-Click Ordering across Website</span>
              </label>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: FOOTER & SOCIALS ==================== */}
        {activeTab === 'footer' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#900C19]" />
                <span>Footer Content & Social Media Profiles</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">ফুটার বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  value={settings.footerDescriptionBn || ''}
                  onChange={(e) => setSettings({ ...settings, footerDescriptionBn: e.target.value })}
                  placeholder="১৯৭২ সাল থেকে ঢাকার মতিঝিলের বাণিজ্যিক হৃদয়ে ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি ও কাচ্চির বিশ্বস্ত ঠিকানা।"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Footer Description (English)</label>
                <textarea
                  rows={3}
                  value={settings.footerDescriptionEn || ''}
                  onChange={(e) => setSettings({ ...settings, footerDescriptionEn: e.target.value })}
                  placeholder="Authentic 1972 Bengali heritage cuisine in Motijheel, Dhaka."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">কপিরাইট টেক্সট (বাংলা)</label>
                <input
                  type="text"
                  value={settings.copyrightTextBn || ''}
                  onChange={(e) => setSettings({ ...settings, copyrightTextBn: e.target.value })}
                  placeholder="© ১৯৭২-২০২৬ ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট। সর্বস্বত্ব সংরক্ষিত।"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  value={settings.socialLinks?.facebook || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/gharowahotel"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={settings.socialLinks?.instagram || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/gharowarestaurant"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">YouTube Channel URL</label>
                <input
                  type="url"
                  value={settings.socialLinks?.youtube || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                    })
                  }
                  placeholder="https://youtube.com/@gharowarestaurant"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: GENERAL & DELIVERY ==================== */}
        {activeTab === 'general' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#900C19]" />
                <span>General Restaurant & Delivery Fee Rules</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">ডেলিভারি চার্জ (৳) Standard</label>
                <input
                  type="number"
                  value={settings.standardDeliveryFee || 60}
                  onChange={(e) => setSettings({ ...settings, standardDeliveryFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ফ্রি ডেলিভারি সীমা (৳)</label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold || 1500}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ন্যূনতম অর্ডার মূল্য (৳)</label>
                <input
                  type="number"
                  value={settings.minOrderAmount || 150}
                  onChange={(e) => setSettings({ ...settings, minOrderAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>
            </div>

            {/* Menu Board Photo Upload */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <ImageUploadField
                label="Physical Restaurant Menu Board Image (রেস্তোরাঁর অফিসিয়াল প্রাইস বোর্ড ছবি)"
                value={settings.menuBoardImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, menuBoardImageUrl: url })}
                helperText="Upload photo of your restaurant's physical menu board for customers to view original prices."
              />

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium text-xs">
                <input
                  type="checkbox"
                  checked={settings.isMenuBoardEnabled !== false}
                  onChange={(e) => setSettings({ ...settings, isMenuBoardEnabled: e.target.checked })}
                  className="rounded text-[#900C19] focus:ring-[#900C19]"
                />
                <span>Enable Menu Board Modal Button in Public Menu page</span>
              </label>
            </div>
          </div>
        )}

        {/* ==================== TAB 8: SEO & OPENGRAPH ==================== */}
        {activeTab === 'seo' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#900C19]" />
                <span>Search Engine Optimization (SEO) & Social Sharing (OG)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                গুগল সার্চ ও ফেসবুক/হোয়াটসঅ্যাপে শেয়ার করার মেটা টাইটেল ও মেটা বিবরণী
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Website Meta Title (এসইও শিরোনাম)</label>
                <input
                  type="text"
                  value={settings.seoTitle || ''}
                  onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                  placeholder="ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট | Gharowa Hotel & Restaurant (Since 1972)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Website Meta Description (এসইও মেটা ডেসক্রিপশন)</label>
                <textarea
                  rows={2}
                  value={settings.seoDescription || ''}
                  onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                  placeholder="১৯৭২ সাল থেকে মতিঝিল ঢাকার সেরা ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, কাচ্চি ও খাঁটি বাংলা খাবার।"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">OpenGraph Title (সোশ্যাল শেয়ার টাইটেল)</label>
                  <input
                    type="text"
                    value={settings.ogTitle || ''}
                    onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                    placeholder="Gharowa Hotel & Restaurant (Since 1972) - Motijheel, Dhaka"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">OpenGraph Description</label>
                  <input
                    type="text"
                    value={settings.ogDescription || ''}
                    onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                    placeholder="Order authentic 1972 Mutton Khichuri & traditional Bengali delicacies."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#900C19]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="OpenGraph Social Share Image (সোশ্যাল মিডিয়া প্রিভিউ ছবি)"
                value={settings.ogImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, ogImageUrl: url })}
                helperText="1200x630 image displayed when link is shared on WhatsApp, Facebook, etc."
              />
            </div>
          </div>
        )}

        {/* Global Save Button Bar */}
        <div className="sticky bottom-4 z-30 p-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg flex items-center justify-between">
          <p className="text-xs text-slate-500 font-normal">
            পরিবর্তনসমূহ সাথে সাথে পাবলিক ওয়েবসাইটে দৃশ্যমান হবে।
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>সকল পরিবর্তন সংরক্ষণ করুন (Save All Changes)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
