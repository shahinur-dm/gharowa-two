import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogVideo extends Document {
  title: string;
  titleBn?: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  authorName?: string;
  displayOrder: number;
  isActive: boolean;
}

const BlogVideoSchema = new Schema<IBlogVideo>(
  {
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, default: '', trim: true },
    videoUrl: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, required: true, trim: true },
    duration: { type: String, default: '03:45' },
    authorName: { type: String, default: 'Gharowa Kitchen' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const BlogVideo =
  mongoose.models.BlogVideo || mongoose.model<IBlogVideo>('BlogVideo', BlogVideoSchema);
