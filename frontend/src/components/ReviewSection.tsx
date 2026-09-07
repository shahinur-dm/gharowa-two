'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { CustomerReview } from '../types';
import { api } from '../lib/api';
import GharowaLogo from './GharowaLogo';

// Google Colored G Icon
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

const avatarColors = [
  'bg-slate-700 text-white',
  'bg-indigo-600 text-white',
  'bg-teal-700 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-emerald-700 text-white',
  'bg-cyan-700 text-white',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setReviews(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch reviews', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Duplicate reviews for seamless infinite right-to-left marquee
  const displayReviews = reviews.length > 0 ? [...reviews, ...reviews, ...reviews, ...reviews] : [];

  return (
    <section className="py-6 sm:py-8 bg-[#FAFAF9] relative overflow-hidden font-sans border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Our Menu Pill style */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-[#900C19] text-white shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Reviews
            </h2>
          </div>
        </div>

        {/* Reviews Layout (Store Card + Automatic Horizontal Reviews Slider) */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-4 sm:gap-5">
          {/* Store Overview Card ("Write a review" box matching exact review card width) */}
          <div className="w-[260px] sm:w-[280px] shrink-0 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between items-center text-center">
            <div className="w-full flex flex-col items-center">
              {/* Store Logo Emblem */}
              <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center p-2 mb-2.5 shadow-sm border border-slate-800">
                <GharowaLogo size={38} variant="emblem" />
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-tight">
                Gharowa Hotel & Restaurant
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Motijheel, Dhaka</p>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs sm:text-sm font-bold text-slate-800 mr-1">4.9</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 font-medium">
                2,154+ Google reviews
              </p>
            </div>

            {/* Write a Review Button */}
            <a
              href="https://maps.google.com/?q=Gharowa+Hotel+Restaurant+Motijheel+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 w-full py-2 px-3 rounded-xl border border-slate-200/90 hover:border-[#EA580C] hover:text-[#EA580C] text-slate-700 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 bg-slate-50/80 hover:bg-orange-50/50 shadow-2xs"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Write a review</span>
            </a>
          </div>

          {/* Seamless Infinite Reviews Carousel (Right to Left) */}
          <div className="flex-1 relative min-w-0 overflow-hidden w-full">
            <div className="animate-marquee-continuous flex items-stretch gap-4 py-1 px-1">
              {displayReviews.map((review, index) => {
                const initial = review.customerName.charAt(0).toUpperCase() || 'U';
                const colorClass = getAvatarColor(review.customerName);

                return (
                  <div
                    key={`${review._id}-${index}`}
                    className="w-[260px] sm:w-[280px] shrink-0 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between select-none"
                  >
                    <div>
                      {/* Card Header: Avatar, Name, Date, Google Icon */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {review.avatarUrl ? (
                            <img
                              src={review.avatarUrl}
                              alt={review.customerName}
                              className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                            />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-full ${colorClass} font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                            >
                              {initial}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                              {review.customerName}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-normal">
                              {review.reviewDateText || '1 year ago'}
                            </p>
                          </div>
                        </div>

                        {/* Google G Badge */}
                        <GoogleIcon />
                      </div>

                      {/* Stars & Verified Check */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex items-center gap-0.5">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                            />
                          ))}
                        </div>
                        {review.isVerified !== false && (
                          <div className="flex items-center text-blue-500" title="Verified Reviewer">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Review Text */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                        {review.reviewText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
