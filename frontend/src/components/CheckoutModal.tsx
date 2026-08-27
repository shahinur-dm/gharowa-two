'use client';

import React, { useState } from 'react';
import { X, MessageCircle, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';
import { formatPrice, toBanglaNumber } from '../lib/bangla';
import { api } from '../lib/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { language } = useLanguageStore();
  const {
    items,
    coupon,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getGrandTotal,
    clearCart,
  } = useCartStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: 'মতিঝিল / Motijheel',
    paymentMethod: 'cash_on_delivery',
    specialInstructions: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const grandTotal = getGrandTotal();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন' : 'Please enter your name');
      return;
    }
    if (formData.phone.replace(/[^\d]/g, '').length < 11) {
      setErrorMessage(language === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন' : 'Valid 11 digit phone number required');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage(language === 'bn' ? 'ডেলিভারি ঠিকানা লিখুন' : 'Please enter delivery address');
      return;
    }

    try {
      setIsLoading(true);

      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          address: `${formData.address.trim()}, ${formData.area}`,
          area: formData.area,
        },
        items: items.map((item) => ({
          menuItemId: item.menuItem._id,
          quantity: item.quantity,
          notes: item.notes,
        })),
        couponCode: coupon?.code,
        paymentMethod: formData.paymentMethod,
        source: 'website_whatsapp',
        specialInstructions: formData.specialInstructions.trim() || undefined,
      };

      const res: any = await api.post('/orders', orderPayload);

      if (res.success && res.data) {
        setPlacedOrder(res.data);
        clearCart();

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#D97706', '#10B981'],
        });

        // Automatically open WhatsApp deep-link in new tab
        if (res.data.whatsappDeepLink) {
          window.open(res.data.whatsappDeepLink, '_blank');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-obsidian-400 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-gold-lg my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-obsidian-300 hover:bg-obsidian-200 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!placedOrder ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold font-bengali text-white">
                {language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm Your Order'}
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              {language === 'bn'
                ? 'আপনার তথ্য দিন। অর্ডারটি ডেটাবেজে সংরক্ষিত হয়ে সরাসরি WhatsApp-এ বার্তা পাঠাবে।'
                : 'Enter your details. Order will be recorded and redirected to WhatsApp.'}
            </p>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'bn' ? 'উদা: রহিম আহমেদ' : 'e.g. Rahim Ahmed'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  {language === 'bn' ? 'পূর্ণাঙ্গ ডেলিভারি ঠিকানা *' : 'Full Delivery Address *'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={
                    language === 'bn'
                      ? 'বাড়ি নম্বর, রোড, এলাকা (উদা: মতিঝিল সি/এ, ঢাকা)'
                      : 'House, Road, Area (e.g. Motijheel C/A, Dhaka)'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              {/* Area & Special Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    {language === 'bn' ? 'এলাকা' : 'Area'}
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white text-xs focus:outline-none focus:border-gold-500"
                  >
                    <option value="মতিঝিল / Motijheel">মতিঝিল / Motijheel</option>
                    <option value="দিলকুশা / Dilkusha">দিলকুশা / Dilkusha</option>
                    <option value="পল্টন / Paltan">পল্টন / Paltan</option>
                    <option value="সেগুনবাগিচা / Segunbagicha">সেগুনবাগিচা / Segunbagicha</option>
                    <option value="কাকরাইল / Kakrail">কাকরাইল / Kakrail</option>
                    <option value="শান্তিনগর / Shantinagar">শান্তিনগর / Shantinagar</option>
                    <option value="ঢাকা শহরের অন্যান্য এলাকা">ঢাকা শহরের অন্যান্য এলাকা</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    {language === 'bn' ? 'বিশেষ অনুরোধ (ঐচ্ছিক)' : 'Special Request'}
                  </label>
                  <input
                    type="text"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder={language === 'bn' ? 'উদা: ঝাল কম, অতিরিক্ত সালাদ' : 'Less spicy, extra salad'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Payment Method Choice */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cash_on_delivery' })}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      formData.paymentMethod === 'cash_on_delivery'
                        ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-gold'
                        : 'bg-obsidian-300 border-gold-500/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>ক্যাশ অন ডেলিভারি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      formData.paymentMethod === 'bkash'
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md'
                        : 'bg-obsidian-300 border-gold-500/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>bKash (বিকাশ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'nagad' })}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      formData.paymentMethod === 'nagad'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md'
                        : 'bg-obsidian-300 border-gold-500/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Nagad (নগদ)</span>
                  </button>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-3.5 rounded-2xl bg-obsidian-300/80 border border-gold-500/15 space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>সাবটোটাল ({language === 'bn' ? toBanglaNumber(items.length) : items.length} আইটেম):</span>
                  <span className="font-semibold text-white">{formatPrice(subtotal, language)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>কুপন ডিসকাউন্ট ({coupon?.code}):</span>
                    <span>-{formatPrice(discount, language)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>{deliveryFee === 0 ? 'ফ্রি (Free)' : formatPrice(deliveryFee, language)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-gold-400">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span>{formatPrice(grandTotal, language)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading || items.length === 0}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>অর্ডার প্রক্রিয়াধীন...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp-এ অর্ডার সম্পন্ন করুন</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Placed Order Success View */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white font-bengali">
                অর্ডার সফলভাবে সম্পন্ন হয়েছে!
              </h3>
              <p className="text-sm text-gold-400 font-mono mt-1 font-bold">
                Order ID: {placedOrder.orderNumber}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                আপনার অর্ডারটি সরাসরি কিচেনে পাঠানো হয়েছে। WhatsApp উইন্ডো খুলে অর্ডার নিশ্চিত করুন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-300 border border-gold-500/20 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">মোট টাকা:</span>
                <span className="font-bold text-gold-400">{formatPrice(placedOrder.grandTotal, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ডেলিভারি সময়:</span>
                <span className="font-semibold text-white">আনুমানিক ৪৫ মিনিট</span>
              </div>
            </div>

            <div className="space-y-2">
              {placedOrder.whatsappDeepLink && (
                <a
                  href={placedOrder.whatsappDeepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp খুলুন</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-obsidian-300 text-gray-300 hover:text-white text-xs font-semibold"
              >
                বন্ধ করুন / Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
