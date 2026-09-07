'use client';

import React, { useState, useEffect } from 'react';
import { BrandPartner } from '../types';
import { api } from '../lib/api';

export default function TrustedBrandsSection() {
  const [brands, setBrands] = useState<BrandPartner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setBrands(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch brands', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();

    if (typeof window !== 'undefined') {
      window.addEventListener('gharowa_cms_updated', fetchBrands);
      return () => window.removeEventListener('gharowa_cms_updated', fetchBrands);
    }
  }, []);

  // Duplicate brands for seamless infinite right-to-left marquee
  const displayBrands = brands.length > 0 ? [...brands, ...brands, ...brands, ...brands] : [];

  return (
    <section className="py-6 sm:py-8 bg-white relative overflow-hidden font-sans border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Our Menu Pill style */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-[#900C19] text-white shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Trusted by Leading Brands
            </h2>
          </div>
        </div>

        {/* Brands Infinite Marquee Row (Right to Left) */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-continuous flex items-center gap-8 sm:gap-12 md:gap-16 py-2">
            {displayBrands.map((brand, idx) => {
              const logoContent = (
                <div
                  key={`${brand._id}-${idx}`}
                  className="group relative flex items-center justify-center p-2 shrink-0 transition-all duration-300 transform hover:scale-105 select-none"
                  title={brand.name}
                >
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-9 sm:h-11 md:h-12 lg:h-14 w-auto max-w-[150px] sm:max-w-[190px] md:max-w-[220px] object-contain select-none filter transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to text badge if image link fails
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        const textFallback = document.createElement('span');
                        textFallback.className =
                          'px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap';
                        textFallback.innerText = brand.name;
                        target.parentElement.appendChild(textFallback);
                      }
                    }}
                  />
                </div>
              );

              if (brand.websiteUrl) {
                return (
                  <a
                    key={`${brand._id}-${idx}`}
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:outline-none shrink-0"
                  >
                    {logoContent}
                  </a>
                );
              }

              return logoContent;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
