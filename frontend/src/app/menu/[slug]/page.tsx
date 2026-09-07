'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Flame,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  Share2,
} from 'lucide-react';
import { MenuItem, PortionOption, AddOnOption } from '../../../types';
import { api } from '../../../lib/api';
import { useLanguageStore } from '../../../store/languageStore';
import { useCartStore } from '../../../store/cartStore';
import { formatPrice, toBanglaNumber } from '../../../lib/bangla';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { language } = useLanguageStore();
  const { addItem, openCart } = useCartStore();

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedPortion, setSelectedPortion] = useState<PortionOption | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Fallback demo dish if backend item not found
  const fallbackDish: MenuItem = {
    _id: 'demo-mutton-khichuri',
    nameBn: 'খাসির ভুনা খিচুড়ি',
    nameEn: 'Mutton Khichuri',
    slug: 'mutton-khichuri',
    category: 'khichuri',
    price: 280,
    originalPrice: 320,
    descriptionBn: '১৯৭২ সালের ঐতিহ্যবাহী গোপন মসলায় রান্না করা খাঁটি দেশি খাসির মাংসের তুলতুলে ভুনা খিচুড়ি। সুগন্ধি চিনিগুঁড়া চাল ও খাঁটি গাওয়া ঘিয়ে তৈরি।',
    descriptionEn: 'Fragrant basmati and chinigura rice cooked with tender mutton, aromatic spices and rich flavors. A traditional Bengali favorite.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    ],
    spiceLevel: 2,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    preparationTimeMinutes: 15,
    dietaryTags: ['Heritage Special', 'Best Seller', '100% Halal'],
    displayOrder: 1,
    rating: 4.9,
    reviewsCount: 124,
    portions: [
      { nameBn: 'রেগুলার (১ জন)', nameEn: 'Regular (1 Person)', price: 280, servingSize: '1 Person' },
      { nameBn: 'লার্জ (১-২ জন)', nameEn: 'Large (1-2 Person)', price: 420, servingSize: '1-2 Person' },
      { nameBn: 'ফ্যামিলি (৩-৪ জন)', nameEn: 'Family (3-4 Person)', price: 820, servingSize: '3-4 Person' },
    ],
    addOns: [
      { nameBn: 'অতিরিক্ত খাসির মাংস', nameEn: 'Extra Mutton', price: 80 },
      { nameBn: 'অতিরিক্ত ডিম', nameEn: 'Extra Egg', price: 20 },
      { nameBn: 'সালাদ', nameEn: 'Salad', price: 30 },
      { nameBn: 'বোরহানি (২০০ মি.লি.)', nameEn: 'Borhani (200ml)', price: 50 },
    ],
    nutritionFacts: {
      calories: '450 kcal',
      protein: '18 g',
      carbs: '52 g',
      fat: '15 g',
      fiber: '2 g',
    },
    aboutDishBn: 'আমাদের খাসির ভুনা খিচুড়ি প্রিমিয়াম দেশি খাসি ও খাঁটি গাওয়া ঘি দিয়ে ঐতিহ্যবাহী পদ্ধতিতে তৈরি, যা প্রতি লোকমায় আনে অসাধারণ তৃপ্তি।',
    aboutDishEn: 'Our Mutton Khichuri is slow-cooked with premium rice, tender mutton, and a perfect blend of spices to give you the most authentic taste.',
  };

  const [restaurantSettings, setRestaurantSettings] = useState<any>(null);

  useEffect(() => {
    const fetchDishAndSettings = async () => {
      try {
        setIsLoading(true);
        const [dishRes, settingsRes]: [any, any] = await Promise.all([
          api.get(`/menu/items/${slug}`),
          api.get('/settings'),
        ]);

        if (settingsRes.success && settingsRes.data) {
          setRestaurantSettings(settingsRes.data);
        }

        if (dishRes.success && dishRes.data) {
          setDish(dishRes.data);
          setSelectedImage(dishRes.data.image);
          if (dishRes.data.portions && dishRes.data.portions.length > 0) {
            setSelectedPortion(dishRes.data.portions[0]);
          }
        } else {
          setDish(fallbackDish);
          setSelectedImage(fallbackDish.image);
          setSelectedPortion(fallbackDish.portions![0]);
        }
      } catch (err) {
        console.warn('Using fallback dish for', slug, err);
        setDish(fallbackDish);
        setSelectedImage(fallbackDish.image);
        setSelectedPortion(fallbackDish.portions![0]);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchDishAndSettings();
    }
  }, [slug]);

  if (isLoading || !dish) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-[#900C19] animate-spin" />
      </div>
    );
  }

  // Gallery items list
  const gallery = dish.galleryImages && dish.galleryImages.length > 0
    ? [dish.image, ...dish.galleryImages.filter((img) => img !== dish.image)]
    : [dish.image];

  // Base price computation
  const basePrice = selectedPortion ? selectedPortion.price : dish.price;
  const addOnsTotal = selectedAddOns.reduce((acc, item) => acc + item.price, 0);
  const unitPrice = basePrice + addOnsTotal;
  const grandTotal = unitPrice * quantity;

  const handleToggleAddOn = (addon: AddOnOption) => {
    const exists = selectedAddOns.some((a) => a.nameEn === addon.nameEn);
    if (exists) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.nameEn !== addon.nameEn));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleAddToCart = () => {
    addItem(
      dish,
      quantity,
      undefined,
      selectedPortion
        ? {
            name: language === 'bn' ? selectedPortion.nameBn : selectedPortion.nameEn,
            price: selectedPortion.price,
          }
        : undefined,
      selectedAddOns.map((a) => ({
        name: language === 'bn' ? a.nameBn : a.nameEn,
        price: a.price,
      })),
      unitPrice
    );
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleDirectWhatsApp = () => {
    const phone = restaurantSettings?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801973255888';
    const foodTitle = language === 'bn' ? dish.nameBn : dish.nameEn;
    const portionName = selectedPortion ? ` (${language === 'bn' ? selectedPortion.nameBn : selectedPortion.nameEn})` : '';
    const addOnsStr = selectedAddOns.length > 0 ? ` + ${selectedAddOns.map((a) => a.nameEn).join(', ')}` : '';

    const defaultTemplate = `Hello Gharowa Hotel & Restaurant (Since 1972),\n\nI would like to place an order from your website:\n\n🍛 Food: {{product_name}}\n🔢 Quantity: {{quantity}}\n💰 Unit Price: ৳{{price}}\n💵 Total: ৳{{total}}\n\nPlease confirm availability and delivery details. Thank you!`;
    const template = restaurantSettings?.whatsappOrderTemplate || defaultTemplate;

    const message = template
      .replace(/{{product_name}}/g, `${foodTitle}${portionName}${addOnsStr}`)
      .replace(/{{quantity}}/g, String(quantity))
      .replace(/{{price}}/g, String(unitPrice))
      .replace(/{{total}}/g, String(grandTotal));

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 pb-24 sm:pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-[#900C19] transition-colors">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/menu" className="hover:text-[#900C19] transition-colors">
          {language === 'bn' ? 'মেনু' : 'Menu'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate">
          {language === 'bn' ? dish.nameBn : dish.nameEn}
        </span>
      </nav>

      {/* Main Two-Column Food Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Big Image & Thumbnail Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Selected Image */}
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <Image
              src={selectedImage || dish.image}
              alt={dish.nameEn}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Bestseller Badge */}
            {dish.isBestseller && (
              <div className="absolute top-4 left-4 bg-[#900C19] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-current" />
                <span>{language === 'bn' ? 'বেস্টসেলার' : 'Best Seller'}</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip (Reference 1) */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-[#900C19] scale-95 shadow-md'
                      : 'border-transparent hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Options, Portion Selector, Add-ons & CTA */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-slate-900 font-sans tracking-tight">
                {language === 'bn' ? dish.nameBn : dish.nameEn}
              </h1>

              {dish.isBestseller && (
                <span className="hidden sm:inline-block text-[11px] font-medium bg-red-100 text-[#900C19] px-2.5 py-0.5 rounded-full font-sans">
                  {language === 'bn' ? 'ঐতিহ্যের সেরা' : 'Best Seller'}
                </span>
              )}
            </div>

            {/* Rating and Reviews Count */}
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="font-semibold text-slate-900">{dish.rating || 4.9}</span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-normal">
                ({dish.reviewsCount || 124} {language === 'bn' ? 'গ্রাহক রিভিউ' : 'Reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl sm:text-3xl font-semibold text-slate-900 font-mono mt-3">
              ৳{language === 'bn' ? toBanglaNumber(unitPrice) : unitPrice}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal font-bengali mt-3">
              {language === 'bn' ? dish.descriptionBn : dish.descriptionEn}
            </p>
          </div>

          {/* Portion Selector (Regular, Large, Family) */}
          {dish.portions && dish.portions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                {language === 'bn' ? 'পরিমাণ নির্বাচন করুন (Choose Portion):' : 'Choose Portion:'}
              </label>

              <div className="grid grid-cols-3 gap-3">
                {dish.portions.map((portion, idx) => {
                  const isSelected = selectedPortion?.nameEn === portion.nameEn;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPortion(portion)}
                      className={`p-3 rounded-2xl text-center border-2 transition-all ${
                        isSelected
                          ? 'border-[#900C19] bg-red-50/50 text-[#900C19] shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold">
                        {language === 'bn' ? portion.nameBn : portion.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        ৳{language === 'bn' ? toBanglaNumber(portion.price) : portion.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Checkbox List */}
          {dish.addOns && dish.addOns.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                {language === 'bn' ? 'অতিরিক্ত পদ (Add-ons):' : 'Add-ons:'}
              </label>

              <div className="space-y-2 text-xs">
                {dish.addOns.map((addon, idx) => {
                  const isChecked = selectedAddOns.some((a) => a.nameEn === addon.nameEn);
                  return (
                    <label
                      key={idx}
                      onClick={() => handleToggleAddOn(addon)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#900C19] bg-red-50/30 text-slate-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#900C19] border-[#900C19] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{language === 'bn' ? addon.nameBn : addon.nameEn}</span>
                      </div>
                      <span className="font-mono text-slate-600">
                        +৳{language === 'bn' ? toBanglaNumber(addon.price) : addon.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & Total Price */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 font-bold shadow-sm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm w-6 text-center font-mono">
                {language === 'bn' ? toBanglaNumber(quantity) : quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {language === 'bn' ? 'সর্বমোট' : 'Total Price'}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#900C19] font-mono">
                ৳{language === 'bn' ? toBanglaNumber(grandTotal) : grandTotal}
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & WhatsApp Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-2xl bg-[#900C19] hover:bg-[#780813] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>{language === 'bn' ? 'কার্টে যোগ হয়েছে!' : 'Added to Cart!'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDirectWhatsApp}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{language === 'bn' ? 'এখনই অর্ডার করুন' : 'Order Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tabs: About Dish, Nutrition Facts, Reviews (Reference 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-200">
        {/* Left Side: About This Dish & Nutrition */}
        <div className="lg:col-span-7 space-y-6">
          {/* About Dish */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 font-sans">
              {language === 'bn' ? 'এই খাবারের বিশেষত্ব' : 'About This Dish'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal font-bengali">
              {dish.aboutDishBn && language === 'bn'
                ? dish.aboutDishBn
                : dish.aboutDishEn ||
                  'Our Mutton Khichuri is slow-cooked with premium rice, tender mutton, and a perfect blend of spices to give you the most authentic taste.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-[#900C19]" />
                <span className="font-normal font-bengali">{language === 'bn' ? 'প্রিমিয়াম কোয়ালিটি খাসির মাংস' : 'Premium Quality Mutton'}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <Sparkles className="w-4 h-4 text-[#900C19]" />
                <span className="font-normal font-bengali">{language === 'bn' ? 'সুগন্ধি ঐতিহ্যবাহী গোপন মশলা' : 'Aromatic Traditional Spices'}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <Flame className="w-4 h-4 text-[#900C19]" />
                <span className="font-normal font-bengali">{language === 'bn' ? 'ধীমে আঁচে সুসিদ্ধ ও নরম' : 'Perfect Cooked & Tender'}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-[#900C19]" />
                <span className="font-normal font-bengali">{language === 'bn' ? 'স্বাস্থ্যসম্মত ও শতভাগ হালাল' : 'Hygienically Prepared 100% Halal'}</span>
              </div>
            </div>
          </div>

          {/* Nutrition Facts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 font-sans">
              {language === 'bn' ? 'পুষ্টি উপাদান (প্রতি পরিবেশন)' : 'Nutrition Facts (Per Serving)'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="text-slate-400 text-[10px] font-normal">Calories</div>
                <div className="font-semibold text-slate-800 text-sm font-mono mt-1">
                  {dish.nutritionFacts?.calories || '450 kcal'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="text-slate-400 text-[10px] font-normal">Protein</div>
                <div className="font-semibold text-slate-800 text-sm font-mono mt-1">
                  {dish.nutritionFacts?.protein || '18 g'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="text-slate-400 text-[10px] font-normal">Carbohydrates</div>
                <div className="font-semibold text-slate-800 text-sm font-mono mt-1">
                  {dish.nutritionFacts?.carbs || '52 g'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="text-slate-400 text-[10px] font-normal">Fat</div>
                <div className="font-semibold text-slate-800 text-sm font-mono mt-1">
                  {dish.nutritionFacts?.fat || '15 g'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="text-slate-400 text-[10px] font-normal">Fiber</div>
                <div className="font-semibold text-slate-800 text-sm font-mono mt-1">
                  {dish.nutritionFacts?.fiber || '2 g'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Customer Reviews Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 font-sans">
              {language === 'bn' ? `গ্রাহক রিভিউ (${dish.reviewsCount || 124})` : `Customer Reviews (${dish.reviewsCount || 124})`}
            </h3>
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-xs font-semibold text-[#900C19] hover:underline font-sans"
            >
              {language === 'bn' ? 'রিভিউ লিখুন' : 'Write a Review'}
            </button>
          </div>

          {/* Rating Big Score & Breakdown Bars */}
          <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
            <div className="text-center">
              <div className="text-4xl font-semibold text-slate-900 font-sans">
                {dish.rating || 4.9}
              </div>
              <div className="flex items-center justify-center gap-0.5 text-amber-500 my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <div className="text-[10px] text-slate-400 font-normal">
                {dish.reviewsCount || 124} {language === 'bn' ? 'রিভিউ' : 'Ratings'}
              </div>
            </div>

            {/* Rating Bar Distribution */}
            <div className="flex-1 space-y-1.5 text-xs">
              {[
                { stars: 5, count: 106, pct: '85%' },
                { stars: 4, count: 12, pct: '10%' },
                { stars: 3, count: 4, pct: '3%' },
                { stars: 2, count: 1, pct: '1%' },
                { stars: 1, count: 1, pct: '1%' },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 w-3">{row.stars}★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#900C19]"
                      style={{ width: row.pct }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono w-6 text-right">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px]">
                    SA
                  </div>
                  <span>Sakib Ahmed</span>
                </div>
                <span className="text-[10px] text-slate-400">2 days ago</span>
              </div>
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed font-light">
                The best Mutton Khichuri I’ve ever had! Perfect taste and portion. Highly recommended.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-red-200 text-red-900 font-bold flex items-center justify-center text-[10px]">
                    TN
                  </div>
                  <span>Tanvir Nahid</span>
                </div>
                <span className="text-[10px] text-slate-400">5 days ago</span>
              </div>
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed font-light">
                মাংসের নরম ও রসালো ভাব ছিল অসাধারণ। ঘি এর সুবাস পুরো ঘরোয়া স্বাদের কথা মনে করিয়ে দেয়।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Ordering Bar (Reference 1 Mobile Preview) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md p-3 px-4 border-t border-slate-200 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
            {language === 'bn' ? dish.nameBn : dish.nameEn}
          </div>
          <div className="text-sm font-extrabold text-[#900C19] font-mono">
            ৳{language === 'bn' ? toBanglaNumber(grandTotal) : grandTotal}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="py-2.5 px-6 rounded-xl bg-[#900C19] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{language === 'bn' ? 'অর্ডার করুন' : 'Add to Cart'}</span>
        </button>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'আপনার মতামত ও রিভিউ লিখুন' : 'Write a Review'}
            </h3>
            <div className="flex gap-1 text-amber-500 cursor-pointer">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-500" />
              ))}
            </div>
            <textarea
              rows={3}
              placeholder={language === 'bn' ? 'খাবারের স্বাদ ও অভিজ্ঞতা সম্পর্কে লিখুন...' : 'Share your food experience...'}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#900C19]"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  alert(language === 'bn' ? 'আপনার মতামতের জন্য ধন্যবাদ!' : 'Thank you for your review!');
                  setShowReviewModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#900C19] text-white"
              >
                {language === 'bn' ? 'জমা দিন' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
