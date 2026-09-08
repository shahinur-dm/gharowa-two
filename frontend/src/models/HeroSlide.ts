import mongoose, { Document, Schema } from 'mongoose';

export interface IHeroSlide extends Document {
  title: string;
  titleBn?: string;
  subtitleEn?: string;
  subtitleBn?: string;
  badgeText?: string;
  badgeBn?: string;
  mediaType?: 'image' | 'video';
  mainImageUrl: string;
  videoUrl?: string;
  supportingImageUrl?: string;
  displayOrder: number;
  slideDurationSeconds?: number;
  isActive: boolean;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, default: '', trim: true },
    subtitleEn: { type: String, default: '', trim: true },
    subtitleBn: { type: String, default: '', trim: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    mainImageUrl: { type: String, required: true, trim: true },
    videoUrl: { type: String, default: '', trim: true },
    supportingImageUrl: { type: String, default: '', trim: true },
    badgeText: { type: String, default: '1972', trim: true },
    badgeBn: { type: String, default: '', trim: true },
    displayOrder: { type: Number, default: 0 },
    slideDurationSeconds: { type: Number, default: 4, min: 2, max: 20 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const HeroSlide =
  mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
