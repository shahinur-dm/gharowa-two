'use client';

import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  MapPin,
  Phone,
  User,
  CreditCard,
  Building,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';
import { formatPrice } from '../lib/bangla';
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
    closeCart,
  } = useCartStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: 'motijheel',
    landmark: '',
    specialInstructions: '',
    paymentMethod: 'cash_on_delivery',
    orderType: 'delivery',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

    const cleanPhone = formData.phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage(language === 'bn' ? 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন' : 'Please enter a valid 11-digit phone number');
      return;
    }

    if (formData.orderType === 'delivery' && !formData.address.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে পূর্ণাঙ্গ ডেলিভারি ঠিকানা দিন' : 'Please enter delivery address');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        customer: {
          name: formData.name.trim(),
          phone: cleanPhone,
          address: formData.address.trim(),
        },
        deliveryAddress: {
          area: formData.area,
          streetAddress: formData.address.trim(),
          landmark: formData.landmark.trim() || undefined,
        },
        items: items.map((i) => ({
          menuItemId: i.menuItem._id,
          nameBn: i.menuItem.nameBn,
          nameEn: i.menuItem.nameEn,
          quantity: i.quantity,
          unitPrice: i.menuItem.price,
          totalPrice: i.menuItem.price * i.quantity,
        })),
        orderType: formData.orderType,
        paymentMethod: formData.paymentMethod,
        couponCode: coupon?.code || undefined,
        specialInstructions: formData.specialInstructions.trim() || undefined,
      };

      const response: any = await api.post('/orders', payload);

      if (response.success && response.data) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B91C1C', '#D97706', '#10B981'],
        });

        const waLink = response.data.whatsappDeepLink;
        clearCart();
        onClose();
        closeCart();

        if (waLink) {
          window.open(waLink, '_blank');
        }
      } else {
        throw new Error(response.message || 'অর্ডার প্রক্রিয়া সম্পন্ন করা যায়নি');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'অর্ডার পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 space-y-5 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-traditional-50 text-traditional-700 border border-traditional-200 text-xs font-medium font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সরাসরি হোয়াটসঅ্যাপে অর্ডার কনফার্মেশন</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 font-sans">
            {language === 'bn' ? 'ডেলিভারি তথ্য পূরণ করুন' : 'Delivery & Contact Details'}
          </h2>
          <p className="text-xs text-slate-500 font-bengali font-normal">
            অর্ডার জমা দেওয়ার সাথে সাথে আপনার অর্ডারের ইনভয়েসসহ WhatsApp চ্যাট ওপেন হবে।
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-normal">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
          {/* Order Type Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 font-sans">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, orderType: 'delivery' })}
              className={`py-2 rounded-lg font-medium transition-all ${
                formData.orderType === 'delivery'
                  ? 'bg-traditional-700 text-white shadow-sm font-semibold'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              হোম ডেলিভারি (Home Delivery)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, orderType: 'takeaway' })}
              className={`py-2 rounded-lg font-medium transition-all ${
                formData.orderType === 'takeaway'
                  ? 'bg-traditional-700 text-white shadow-sm font-semibold'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              টেক-অ্যাওয়ে (Takeaway / Pickup)
            </button>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1 font-sans">
                {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'bn' ? 'উদা: আরিফুর রহমান' : 'Arifur Rahman'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-traditional-600 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর (WhatsApp) *' : 'Phone Number *'}
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-traditional-600 font-mono shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {formData.orderType === 'delivery' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'ডেলিভারি এলাকা *' : 'Delivery Area *'}
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-traditional-600 shadow-sm"
                >
                  <option value="motijheel">মতিঝিল / দিলকুশা (Motijheel / Dilkusha)</option>
                  <option value="paltan">পল্টন / বিজয়নগর (Paltan / Bijoynagar)</option>
                  <option value="shahbag">শাহবাগ / ঢাকা বিশ্ববিদ্যালয় (Shahbag / DU)</option>
                  <option value="shantinagar">শান্তিনগর / কাকরাইল (Shantinagar / Kakrail)</option>
                  <option value="w客戶wari">ওয়ারী / টিকাটুলি (Wari / Tikatuli)</option>
                  <option value="dhanmondi">ধানমন্ডি (Dhanmondi)</option>
                  <option value="gulshan">গুলশান / বনানী (Gulshan / Banani)</option>
                  <option value="other_dhaka">অন্যান্য এলাকা (Other Dhaka)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'বিস্তারিত ঠিকানা (বাড়ি, রোড, ফ্লোর) *' : 'Detailed Address *'}
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={language === 'bn' ? 'বাড়ি #১২, রোড #৪, ফ্ল্যাট ৩এ' : 'House #12, Road #4, Flat 3A'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-traditional-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {language === 'bn' ? 'পেমেন্ট মাধ্যম *' : 'Payment Method *'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash_on_delivery', name: 'ক্যাশ অন ডেলিভারি (COD)' },
                { id: 'bkash', name: 'বিকাশ (bKash)' },
                { id: 'nagad', name: 'নগদ (Nagad)' },
              ].map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                  className={`p-2.5 rounded-xl text-[11px] font-bold text-center border transition-all ${
                    formData.paymentMethod === pm.id
                      ? 'bg-traditional-50 border-traditional-700 text-traditional-800 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pm.name}
                </button>
              ))}
            </div>
          </div>

          {/* Bill Summary Banner */}
          <div className="p-3.5 rounded-2xl bg-warm-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-700 font-semibold font-bengali">সর্বমোট পরিশোধযোগ্য বিল:</span>
            <span className="text-base font-extrabold text-traditional-700 font-mono">
              {formatPrice(grandTotal, language)}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-traditional-700 hover:bg-traditional-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-red transition-all disabled:opacity-50 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>অর্ডার তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp-এ সরাসরি অর্ডার পাঠান (Confirm Order)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
