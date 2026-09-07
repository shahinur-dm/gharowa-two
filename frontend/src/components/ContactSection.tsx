'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { RestaurantSettings } from '../types';
import { useLanguageStore } from '../store/languageStore';

interface ContactSectionProps {
  settings?: RestaurantSettings | null;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const { language } = useLanguageStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });

  const phone = settings?.phone || '01973255888';
  const whatsapp = settings?.whatsappNumber || '8801973255888';
  const email = settings?.email || 'info@gharowarestaurant.com';
  const address =
    language === 'bn'
      ? settings?.addressBn || '৯/সি মতিঝিল বা/এ, ঢাকা-১০০০ (মতিঝিল মেট্রোরেল স্টেশন সংলগ্ন)'
      : settings?.addressEn || '9/C Motijheel C/A, Dhaka-1000 (Next to Metro Rail Station)';
  const hours =
    language === 'bn'
      ? settings?.openingHoursBn || 'সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)'
      : settings?.openingHoursEn || '7:00 AM - 11:30 PM (Everyday)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', contact: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-slate-200/70">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-[11px] font-medium tracking-wider text-[#900C19] uppercase mb-1 font-sans">
          {language === 'bn' ? 'যোগাযোগ ও অবস্থান' : 'GET IN TOUCH'}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-slate-900 font-sans tracking-tight">
          {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact Us'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-slate-900 font-sans">
              {language === 'bn' ? 'রেস্তোরাঁর অবস্থান ও সময়সূচি' : 'Restaurant Location & Hours'}
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#900C19] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-slate-800 font-sans">{language === 'bn' ? 'ঠিকানা' : 'Address'}</div>
                  <div className="font-bengali font-normal">{address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#900C19] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-slate-800 font-sans">{language === 'bn' ? 'হটলাইন' : 'Phone'}</div>
                  <a href={`tel:${phone}`} className="hover:text-[#900C19] font-medium font-mono">{phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#900C19] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-slate-800 font-sans">{language === 'bn' ? 'ইমেইল' : 'Email'}</div>
                  <div className="font-normal">{email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#900C19] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-slate-800 font-sans">{language === 'bn' ? 'খোলার সময়' : 'Opening Hours'}</div>
                  <div className="font-bengali font-normal">{hours}</div>
                </div>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 tracking-normal"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp-এ সরাসরি বার্তা দিন</span>
          </a>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 font-sans mb-4">
            {language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send Us a Message'}
          </h3>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-semibold text-sm">
                {language === 'bn' ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
              </div>
              <div className="text-xs text-emerald-700 font-normal">
                {language === 'bn' ? 'আমরা দ্রুত আপনার সাথে যোগাযোগ করব।' : 'We will get back to you shortly.'}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1 font-sans">
                  {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter your name'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#900C19] transition-colors font-normal"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 font-sans">
                  {language === 'bn' ? 'মোবাইল নম্বর / ইমেইল *' : 'Phone / Email *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#900C19] transition-colors font-normal"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 font-sans">
                  {language === 'bn' ? 'আপনার বার্তা বা ফিডব্যাক *' : 'Message or Feedback *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={language === 'bn' ? 'আপনার মতামত বা প্রশ্ন লিখুন...' : 'Write your message...'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#900C19] transition-colors font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#900C19] hover:bg-[#780813] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
