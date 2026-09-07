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
  }, []);

  if (!isLoading && brands.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-14 bg-white relative overflow-hidden font-sans border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Reference Screenshot */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              <span className="text-slate-900">Trusted by </span>
              <span className="text-[#EA580C]">Leading Brands</span>
            </h2>
            <span className="w-1 h-7 sm:h-8 bg-[#EA580C] rounded-full inline-block" />
          </div>
        </div>

        {/* Brands Logo Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {brands.map((brand) => {
            const logoContent = (
              <div
                key={brand._id}
                className="group relative flex items-center justify-center p-2 transition-all duration-300 transform hover:scale-105"
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
                  key={brand._id}
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none"
                >
                  {logoContent}
                </a>
              );
            }

            return logoContent;
          })}
        </div>
      </div>
    </section>
  );
}
