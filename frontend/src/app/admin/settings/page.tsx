'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Phone, MessageCircle, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { RestaurantSettings } from '../../../types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
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
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-gold-400" />
            <span>Restaurant Configuration (রেস্তোরাঁ সেটিংস)</span>
          </h1>
          <p className="text-xs text-gray-400">
            হটলাইন নম্বর, WhatsApp প্রাপক নম্বর, ডেলিভারি ফি ও ঘোষণা পরিবর্তন
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>সেটিংস সংরক্ষিত হয়েছে!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact & WhatsApp Info */}
        <div className="p-6 rounded-3xl bg-obsidian-400 border border-gold-500/15 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-gold-400" />
            <span>Contact & WhatsApp Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-300 mb-1">
                হটলাইন ফোন নম্বর
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white font-mono focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1">
                WhatsApp অর্ডার গ্রহণকারী নম্বর (880XXXXXXXXXX) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white font-mono focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Delivery Charges */}
        <div className="p-6 rounded-3xl bg-obsidian-400 border border-gold-500/15 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Delivery & Order Limits</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white font-mono focus:outline-none focus:border-gold-500"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white font-mono focus:outline-none focus:border-gold-500"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white font-mono focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Address & Announcements */}
        <div className="p-6 rounded-3xl bg-obsidian-400 border border-gold-500/15 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>Address & Announcement Banner</span>
          </h3>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">ঠিকানা (বাংলা)</label>
            <input
              type="text"
              value={settings.addressBn}
              onChange={(e) => setSettings({ ...settings, addressBn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">ঘোষণা ব্যানার (Announcement)</label>
            <input
              type="text"
              value={settings.announcementBn || ''}
              onChange={(e) => setSettings({ ...settings, announcementBn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-gold transition-all"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>সংরক্ষণ করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>সেটিংস আপডেট সংরক্ষণ করুন</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
