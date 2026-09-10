import { connectToDatabase } from './mongodb';
import { Coupon } from '@/models/Coupon';
import { InventoryItem } from '@/models/InventoryItem';
import { Reservation } from '@/models/Reservation';
import { MenuCategory } from '@/models/MenuCategory';
import { MenuItem } from '@/models/MenuItem';
import { HeroSlide } from '@/models/HeroSlide';
import { BrandPartner } from '@/models/BrandPartner';
import { CustomerReview } from '@/models/CustomerReview';
import { BlogVideo } from '@/models/BlogVideo';
import {
  initialCategories,
  initialMenuItems,
  initialHeroSlides,
  initialBrandPartners,
  initialCustomerReviews,
  initialBlogVideos,
} from './serverStore';

let bootstrapPromise: Promise<void> | null = null;

export async function ensureDatabaseBootstrapped(): Promise<void> {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const db = await connectToDatabase();
      if (!db) return;

      // 1. Coupons
      const couponCount = await Coupon.countDocuments({});
      if (couponCount === 0) {
        await Coupon.create([
          {
            code: 'GHAROWA50',
            titleBn: '৫০ টাকা ছাড় (সকল অর্ডারে)',
            titleEn: '৳50 Off on orders above ৳400',
            discountType: 'fixed',
            discountValue: 50,
            minOrderAmount: 400,
            maxDiscountAmount: 50,
            expiryDate: '2026-12-31',
            isActive: true,
          },
          {
            code: 'SPECIAL10',
            titleBn: '১০% স্পেশাল ডিসকাউন্ট',
            titleEn: '10% Off on orders above ৳600',
            discountType: 'percentage',
            discountValue: 10,
            minOrderAmount: 600,
            maxDiscountAmount: 150,
            expiryDate: '2026-12-31',
            isActive: true,
          },
        ]);
      }

      // 2. Inventory Items
      const invCount = await InventoryItem.countDocuments({});
      if (invCount === 0) {
        await InventoryItem.create([
          {
            nameBn: 'খাসির মাংস (Mutton)',
            nameEn: 'Fresh Mutton Shank & Shoulder',
            category: 'Meat',
            currentStock: 45,
            minThreshold: 20,
            unit: 'কেজি (kg)',
            costPerUnit: 1100,
            lastRestocked: '2026-09-07',
          },
          {
            nameBn: 'বাসমতী চাল (Basmati Rice)',
            nameEn: 'Premium Kalijeera / Basmati Rice',
            category: 'Grains',
            currentStock: 120,
            minThreshold: 50,
            unit: 'কেজি (kg)',
            costPerUnit: 140,
            lastRestocked: '2026-09-05',
          },
          {
            nameBn: 'খাঁটি সরিষার তেল ও ঘি',
            nameEn: 'Pure Mustard Oil & Ghee',
            category: 'Oils',
            currentStock: 15,
            minThreshold: 10,
            unit: 'লিটার (L)',
            costPerUnit: 280,
            lastRestocked: '2026-09-06',
          },
          {
            nameBn: 'স্পেশাল কাচ্চি ও খিচুড়ি মসলা',
            nameEn: 'Gharowa Secret Spice Blend',
            category: 'Spices',
            currentStock: 8,
            minThreshold: 10,
            unit: 'কেজি (kg)',
            costPerUnit: 950,
            lastRestocked: '2026-09-04',
          },
        ]);
      }

      // 3. Reservations
      const resCount = await Reservation.countDocuments({});
      if (resCount === 0) {
        await Reservation.create([
          {
            name: 'তানভীর আহমেদ',
            phone: '01712345678',
            email: 'tanveer@example.com',
            guests: 4,
            date: '2026-09-10',
            time: '20:00',
            tableType: 'Family Table',
            specialRequests: 'Window seat preferred',
            status: 'confirmed',
          },
          {
            name: 'মাহমুদুল হাসান',
            phone: '01898765432',
            email: 'mahmud@example.com',
            guests: 2,
            date: '2026-09-11',
            time: '19:30',
            tableType: 'Couple',
            status: 'pending',
          },
        ]);
      }
    } catch (err: any) {
      console.warn('Database bootstrap notice:', err.message);
    }
  })();

  return bootstrapPromise;
}

export const ensureDbBootstrapped = ensureDatabaseBootstrapped;
