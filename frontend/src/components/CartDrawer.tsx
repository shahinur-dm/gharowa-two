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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-obsidian-500 border-l border-gold-500/20 text-white flex flex-col justify-between shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-gold-500/15 flex items-center justify-between bg-obsidian-400/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-bengali">
                    {language === 'bn' ? 'আপনার খাবার কার্ট' : 'Your Food Cart'}
                  </h2>
                  <p className="text-xs text-gold-400">
                    {language === 'bn'
                      ? `${toBanglaNumber(items.length)} টি পদ নির্বাচিত`
                      : `${items.length} items selected`}
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full bg-obsidian-300 hover:bg-obsidian-200 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery Progress Bar */}
            {subtotal > 0 && (
              <div className="px-5 py-2.5 bg-obsidian-400/80 border-b border-white/5">
                <div className="flex justify-between items-center text-[11px] text-gray-300 mb-1.5 font-bengali">
                  {remainingForFreeDelivery > 0 ? (
                    <span>
                      আর <strong className="text-gold-400">{formatPrice(remainingForFreeDelivery, language)}</strong> যোগ করলে ডেলিভারি ফ্রি!
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন
                    </span>
                  )}
                  <span className="font-mono text-gold-400">{freeDeliveryProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-obsidian-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-obsidian-300 border border-gold-500/20 flex items-center justify-center text-gold-400/40">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-bengali">
                      {language === 'bn' ? 'কার্ট খালি রয়েছে' : 'Your cart is empty'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                      {language === 'bn'
                        ? 'মেনু থেকে ঘরোয়ার স্পেশাল খাসির ভুনা খিচুড়ি বা কাচ্চি যোগ করুন!'
                        : 'Explore our menu to add authentic 1972 Gharowa specialties!'}
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-5 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs shadow-gold hover:bg-gold-400 transition-all"
                  >
                    {language === 'bn' ? 'মেনু দেখুন' : 'Explore Menu'}
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.menuItem._id}
                    className="p-3 rounded-2xl bg-obsidian-400/70 border border-gold-500/15 flex gap-3 items-center group"
                  >
                    {/* Item Image */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-obsidian-600 shrink-0">
                      <Image
                        src={item.menuItem.image}
                        alt={item.menuItem.nameEn}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white font-bengali truncate">
                        {language === 'bn' ? item.menuItem.nameBn : item.menuItem.nameEn}
                      </h4>
                      <p className="text-[11px] font-extrabold text-gold-400 mt-0.5">
                        {formatPrice(item.menuItem.price * item.quantity, language)}
                      </p>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-obsidian-300 rounded-lg border border-gold-500/20 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                            className="p-1 rounded text-gray-300 hover:text-white hover:bg-obsidian-200"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white font-mono">
                            {language === 'bn' ? toBanglaNumber(item.quantity) : item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                            className="p-1 rounded text-gray-300 hover:text-white hover:bg-obsidian-200"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.menuItem._id)}
                          className="p-1 text-gray-500 hover:text-rose-400 transition-colors ml-auto"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gold-500/20 bg-obsidian-400/90 space-y-4">
                {/* Coupon Box */}
                {!coupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-gold-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder={language === 'bn' ? 'কুপন কোড (উদা: GH1972)' : 'Coupon Code (GH1972)'}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-obsidian-300 border border-gold-500/20 text-xs text-white placeholder-gray-500 uppercase focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs disabled:opacity-50 transition-all shadow-gold"
                    >
                      {isApplyingCoupon ? 'যাচাই...' : 'প্রয়োগ'}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>কুপন কোড <strong>{coupon.code}</strong> কার্যকর!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-400 hover:text-rose-300 underline font-semibold text-[11px]"
                    >
                      বাতিল
                    </button>
                  </div>
                )}

                {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}

                {/* Calculation Breakdown */}
                <div className="space-y-1.5 text-xs text-gray-300 border-t border-white/5 pt-3">
                  <div className="flex justify-between">
                    <span>{language === 'bn' ? 'আইটেম মোট:' : 'Subtotal:'}</span>
                    <span className="font-semibold text-white">{formatPrice(subtotal, language)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>{language === 'bn' ? 'ডিসকাউন্ট:' : 'Discount:'}</span>
                      <span>-{formatPrice(discount, language)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery:'}</span>
                    <span>{deliveryFee === 0 ? 'ফ্রি (Free)' : formatPrice(deliveryFee, language)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-gold-400 pt-2 border-t border-white/10">
                    <span>{language === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Grand Total:'}</span>
                    <span>{formatPrice(grandTotal, language)}</span>
                  </div>
                </div>

                {/* Primary WhatsApp Order Checkout CTA */}
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp-এ অর্ডার নিশ্চিত করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
}
