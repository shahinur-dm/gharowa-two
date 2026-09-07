'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle2, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguageStore } from '../store/languageStore';
import { api } from '../lib/api';

export default function ReservationForm() {
  const { language } = useLanguageStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '13:30',
    guestCount: 4,
    seatingPreference: 'family_ac',
    specialRequests: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successReservation, setSuccessReservation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || formData.phone.replace(/[^\d]/g, '').length < 11) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে সঠিক নাম ও মোবাইল নম্বর দিন' : 'Valid name and 11 digit phone required');
      return;
    }

    try {
      setIsLoading(true);
      const res: any = await api.post('/reservations', {
        ...formData,
        guestCount: Number(formData.guestCount),
      });

      if (res.success && res.data) {
        setSuccessReservation(res.data);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#B91C1C', '#D97706', '#10B981'],
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'বুকিং প্রক্রিয়ায় সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card text-slate-800">
      {!successReservation ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-traditional-50 border border-traditional-200 text-traditional-700">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 font-sans">
                {language === 'bn' ? 'টেবিল বুকিং করুন' : 'Book a Dining Table'}
              </h3>
              <p className="text-xs text-slate-500 font-normal font-bengali">
                {language === 'bn' ? 'ফ্যামিলি বা কর্পোরেট লাঞ্চ ও ডিনারের জন্য আগে থেকেই টেবিল কনফার্ম করুন।' : 'Reserve your table in advance for family & corporate dining.'}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-normal">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                {language === 'bn' ? 'আপনার নাম *' : 'Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={language === 'bn' ? 'উদা: আরিফুর রহমান' : 'Arifur Rahman'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-traditional-600 font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-traditional-600 font-normal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                {language === 'bn' ? 'তারিখ *' : 'Date *'}
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-traditional-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'সময় স্লট *' : 'Time Slot *'}
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-traditional-600"
              >
                <option value="12:30">দুপুর ১২:৩০ (Lunch)</option>
                <option value="13:30">দুপুর ১:৩০ (Lunch)</option>
                <option value="14:30">দুপুর ২:৩০ (Lunch)</option>
                <option value="19:30">রাত ৭:৩০ (Dinner)</option>
                <option value="20:30">রাত ৮:৩০ (Dinner)</option>
                <option value="21:30">রাত ৯:৩০ (Dinner)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'অতিথি সংখ্যা' : 'Guests'}
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-traditional-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'bn' ? 'বসার পছন্দ (Seating Preference)' : 'Seating'}
            </label>
            <select
              value={formData.seatingPreference}
              onChange={(e) => setFormData({ ...formData, seatingPreference: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-traditional-600"
            >
              <option value="family_ac">ফ্যামিলি এসি জোন (Family AC)</option>
              <option value="main_hall">মেইন ডাইনিং হল (Main Hall)</option>
              <option value="executive">কর্পোরেট এক্সিকিউটিভ জোন (Executive)</option>
              <option value="vip">ভিআইপি লাউঞ্জ (VIP Lounge)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'bn' ? 'বিশেষ অনুরোধ (ঐচ্ছিক)' : 'Special Requests'}
            </label>
            <input
              type="text"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder={language === 'bn' ? 'উদা: নিরিবিলি কর্নার টেবিল' : 'Quiet corner, etc.'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-traditional-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-traditional-700 hover:bg-traditional-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-red transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>বুকিং করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>টেবিল বুকিং নিশ্চিত করুন</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 font-bengali">
            বুকিং অনুরোধ গৃহীত হয়েছে!
          </h3>
          <p className="text-xs text-traditional-700 font-mono font-bold">
            Reservation ID: {successReservation.reservationNumber}
          </p>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            আমাদের মতিঝিল ব্রাঞ্চ থেকে শীঘ্রই ফোন করে আপনার টেবিল চূড়ান্ত কনফার্ম করা হবে।
          </p>

          <button
            onClick={() => setSuccessReservation(null)}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
          >
            আরেকটি বুকিং করুন
          </button>
        </div>
      )}
    </div>
  );
}
