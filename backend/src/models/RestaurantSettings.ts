import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurantSettings extends Document {
  restaurantNameBn: string;
  restaurantNameEn: string;
  taglineBn: string;
  taglineEn: string;
  establishedYear: number;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressBn: string;
  addressEn: string;
  landmarkBn: string;
  landmarkEn: string;
  openingHoursBn: string;
  openingHoursEn: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  isOnlineOrderActive: boolean;
  announcementBn?: string;
  announcementEn?: string;
  isAnnouncementActive: boolean;
  googleMapsUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

const RestaurantSettingsSchema = new Schema<IRestaurantSettings>(
  {
    restaurantNameBn: { type: String, default: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট' },
    restaurantNameEn: { type: String, default: 'Gharowa Hotel & Restaurant' },
    taglineBn: { type: String, default: '১৯৭২ থেকে ঢাকার হৃদয়ে ঐতিহ্যের স্বাদ' },
    taglineEn: { type: String, default: '50+ Years of Authentic Culinary Heritage in Motijheel, Dhaka' },
    establishedYear: { type: Number, default: 1972 },
    phone: { type: String, default: '01973255888' },
    whatsappNumber: { type: String, default: '8801973255888' },
    email: { type: String, default: 'info@gharowarestaurant.com' },
    addressBn: { type: String, default: '৯/সি মতিঝিল বা/এ, ঢাকা-১০০০' },
    addressEn: { type: String, default: '9/C Motijheel C/A, Dhaka-1000' },
    landmarkBn: { type: String, default: 'মতিঝিল মেট্রোরেল স্টেশন ও শাপলা চত্বরের সংলগ্ন' },
    landmarkEn: { type: String, default: 'Next to Motijheel Metro Station & Shapla Chottor' },
    openingHoursBn: { type: String, default: 'সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)' },
    openingHoursEn: { type: String, default: '7:00 AM - 11:30 PM (Everyday)' },
    standardDeliveryFee: { type: Number, default: 60 },
    freeDeliveryThreshold: { type: Number, default: 1500 },
    minOrderAmount: { type: Number, default: 150 },
    isOnlineOrderActive: { type: Boolean, default: true },
    announcementBn: { type: String, default: '৫০+ বছরের ঐতিহ্যে মতিঝিলের সবচেয়ে জনপ্রিয় খাসির ভুনা খিচুড়ি ও কাচ্চি!' },
    announcementEn: { type: String, default: '50+ Years of heritage! Dhaka’s favorite Mutton Khichuri & Kacchi.' },
    isAnnouncementActive: { type: Boolean, default: true },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=9/C+Motijheel+C/A+Dhaka',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/gharowahotel' },
      instagram: { type: String, default: 'https://instagram.com/gharowarestaurant' },
      youtube: { type: String, default: 'https://youtube.com/@gharowarestaurant' },
    },
  },
  { timestamps: true }
);

export const RestaurantSettings = mongoose.model<IRestaurantSettings>(
  'RestaurantSettings',
  RestaurantSettingsSchema
);
