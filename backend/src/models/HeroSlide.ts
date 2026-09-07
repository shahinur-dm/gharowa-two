import mongoose, { Document, Schema } from 'mongoose';

export interface IHeroSlide extends Document {
  title: string;
  mainImageUrl: string;
  supportingImageUrl?: string;
  badgeText?: string;
  displayOrder: number;
  slideDurationSeconds?: number;
  isActive: boolean;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    title: { type: String, required: true, trim: true },
    mainImageUrl: { type: String, required: true, trim: true },
    supportingImageUrl: { type: String, default: '', trim: true },
    badgeText: { type: String, default: '1972', trim: true },
    displayOrder: { type: Number, default: 0 },
    slideDurationSeconds: { type: Number, default: 4, min: 2, max: 20 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const HeroSlide =
  mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
