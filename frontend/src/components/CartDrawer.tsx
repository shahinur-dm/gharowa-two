'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Tag,
  Sparkles,
  Check,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';
import { formatPrice, toBanglaNumber } from '../lib/bangla';
import { api } from '../lib/api';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { language } = useLanguageStore();
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getGrandTotal,
    freeDeliveryThreshold,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const grandTotal = getGrandTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponInput.trim()) return;

    try {
      setIsApplyingCoupon(true);
      const res: any = await api.post('/coupons/validate', {
        code: couponInput.trim(),
        subtotal,
      });

      if (res.success && res.data) {
        applyCoupon(res.data);
        setCouponSuccess(
          language === 'bn'
            ? `কুপন সফলভাবে যুক্ত হয়েছে! (-${formatPrice(res.data.discountAmount, language)})`
            : `Coupon applied! (-${formatPrice(res.data.discountAmount, language)})`
        );
        setCouponInput('');
      }
    } catch (err: any) {
      setCouponError(err.message || 'অবৈধ কুপন কোড');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={closeCart}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-800 flex flex-col justify-between shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-traditional-50 text-traditional-700 border border-traditional-200">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 font-sans">
                    {language === 'bn' ? 'আপনার খাবার কার্ট' : 'Your Food Cart'}
                  </h2>
                  <p className="text-xs text-traditional-700 font-medium">
                    {language === 'bn'
                      ? `${toBanglaNumber(items.length)} টি পদ নির্বাচিত`
                      : `${items.length} items selected`}
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery Progress Bar */}
            {subtotal > 0 && (
              <div className="px-5 py-2.5 bg-warm-50 border-b border-slate-200">
                <div className="flex justify-between items-center text-[11px] text-slate-700 mb-1.5 font-bengali">
                  {remainingForFreeDelivery > 0 ? (
                    <span>
                      আর <strong className="text-traditional-700">{formatPrice(remainingForFreeDelivery, language)}</strong> যোগ করলে ডেলিভারি ফ্রি!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন
                    </span>
                  )}
                  <span className="font-mono font-bold text-traditional-700">{freeDeliveryProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-traditional-600 to-emerald-600 transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 font-bengali">
                      {language === 'bn' ? 'কার্ট খালি রয়েছে' : 'Your cart is empty'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      {language === 'bn'
                        ? 'মেনু থেকে ঘরোয়ার স্পেশাল খাসির ভুনা খিচুড়ি বা কাচ্চি যোগ করুন!'
                        : 'Explore our menu to add authentic 1972 Gharowa specialties!'}
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-5 py-2 rounded-xl bg-traditional-700 text-white font-bold text-xs shadow-sm hover:bg-traditional-800 transition-all"
                  >
                    {language === 'bn' ? 'মেনু দেখুন' : 'Explore Menu'}
                  </button>
                </div>
              ) : (
                items.map((item, idx) => {
                  const linePrice = (item.unitPrice || item.menuItem.price) * item.quantity;
                  const portionName = item.selectedPortion?.name;
                  return (
                    <div
                      key={`${item.menuItem._id}-${portionName || 'default'}-${idx}`}
                      className="p-3 rounded-2xl bg-white border border-slate-200 flex gap-3 items-start shadow-sm"
                    >
                      {/* Item Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={item.menuItem.image}
                          alt={item.menuItem.nameEn}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 font-bengali truncate">
                          {language === 'bn' ? item.menuItem.nameBn : item.menuItem.nameEn}
                        </h4>

                        {/* Portion badge & add-ons */}
                        {item.selectedPortion && (
                          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                            {item.selectedPortion.name}
                          </div>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <div className="text-[10px] text-amber-700 font-medium">
                            + {item.selectedAddOns.map((a) => a.name).join(', ')}
                          </div>
                        )}

                        <p className="text-[11px] font-extrabold text-[#900C19] font-mono mt-1">
                          {formatPrice(linePrice, language)}
                        </p>

                        {/* Quantity Controller */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5">
                            <button
                              onClick={() =>
                                updateQuantity(item.menuItem._id, item.quantity - 1, portionName)
                              }
                              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-900 font-mono">
                              {language === 'bn' ? toBanglaNumber(item.quantity) : item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.menuItem._id, item.quantity + 1, portionName)
                              }
                              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white"
                              aria-label="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.menuItem._id, portionName)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-auto"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
                {/* Coupon Box */}
                {!coupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder={language === 'bn' ? 'কুপন কোড (GH1972)' : 'Coupon Code'}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 uppercase focus:outline-none focus:border-traditional-600 shadow-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-traditional-700 hover:bg-traditional-800 text-white font-bold text-xs disabled:opacity-50 transition-all shadow-sm"
                    >
                      {isApplyingCoupon ? 'যাচাই...' : 'প্রয়োগ'}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>কুপন কোড <strong>{coupon.code}</strong> কার্যকর!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:text-rose-700 underline font-bold text-[11px]"
                    >
                      বাতিল
                    </button>
                  </div>
                )}

                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-700 font-semibold">{couponSuccess}</p>}

                {/* Calculation Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span>{language === 'bn' ? 'আইটেম মোট:' : 'Subtotal:'}</span>
                    <span className="font-bold text-slate-900 font-mono">{formatPrice(subtotal, language)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>{language === 'bn' ? 'ডিসকাউন্ট:' : 'Discount:'}</span>
                      <span>-{formatPrice(discount, language)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery:'}</span>
                    <span className="font-bold font-mono">{deliveryFee === 0 ? 'ফ্রি (Free)' : formatPrice(deliveryFee, language)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-traditional-700 pt-2 border-t border-slate-200">
                    <span>{language === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Grand Total:'}</span>
                    <span className="font-mono text-base font-semibold">{formatPrice(grandTotal, language)}</span>
                  </div>
                </div>

                {/* Primary WhatsApp Order Checkout CTA */}
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-traditional-700 hover:bg-traditional-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-red transition-all active:scale-[0.99] tracking-normal"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp-এ অর্ডার নিশ্চিত করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
}
