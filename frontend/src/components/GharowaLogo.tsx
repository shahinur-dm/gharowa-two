'use client';

import React from 'react';
import Image from 'next/image';

interface GharowaLogoProps {
  className?: string;
  size?: number;
  variant?: 'emblem' | 'full' | 'header';
  logoUrl?: string;
}

export default function GharowaLogo({
  className = '',
  size = 48,
  variant = 'header',
  logoUrl,
}: GharowaLogoProps) {
  // If custom/admin-uploaded logo URL is provided, display it smoothly
  if (logoUrl && logoUrl.trim().length > 0) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-white border-2 border-amber-400/60 shadow-md ${className}`}
      >
        <Image
          src={logoUrl}
          alt="Gharowa Hotel & Restaurant Logo"
          fill
          priority
          className="object-contain p-1"
          sizes={`${size}px`}
        />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <svg
        width={size * 1.2}
        height={size}
        viewBox="0 0 400 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Background base */}
        <rect width="400" height="380" rx="16" fill="#C5C7CA" />
        
        {/* Yellow Circle R */}
        <circle cx="48" cy="70" r="42" stroke="#FFD700" strokeWidth="14" fill="none" />
        <text x="24" y="94" fill="#E60000" fontSize="72" fontWeight="900" fontFamily="sans-serif">R</text>

        {/* White Silhouette House Border */}
        <path
          d="M 200 24 L 388 174 L 344 174 L 344 320 L 56 320 L 56 174 L 12 174 Z"
          fill="white"
        />

        {/* Red Brick Pattern House Body */}
        <path
          d="M 200 40 L 372 178 L 332 178 L 332 308 L 68 308 L 68 178 L 28 178 Z"
          fill="#D92027"
        />

        {/* Brick Lines Texture */}
        <g stroke="white" strokeWidth="2.5" opacity="0.95">
          <line x1="170" y1="65" x2="230" y2="65" />
          <line x1="145" y1="85" x2="255" y2="85" />
          <line x1="120" y1="105" x2="280" y2="105" />
          <line x1="95" y1="125" x2="305" y2="125" />
          <line x1="70" y1="145" x2="330" y2="145" />
          <line x1="45" y1="165" x2="355" y2="165" />
          <line x1="68" y1="185" x2="332" y2="185" />
          <line x1="68" y1="205" x2="332" y2="205" />
          <line x1="68" y1="225" x2="332" y2="225" />
          <line x1="68" y1="245" x2="332" y2="245" />
          <line x1="68" y1="265" x2="332" y2="265" />
          <line x1="68" y1="285" x2="332" y2="285" />
          <line x1="68" y1="305" x2="332" y2="305" />
        </g>

        {/* Red Door */}
        <rect x="90" y="200" width="65" height="108" fill="#B31317" stroke="white" strokeWidth="3" />
        <circle cx="140" cy="256" r="3.5" fill="white" />

        {/* GH Window Box */}
        <rect x="195" y="220" width="105" height="66" fill="#B31317" stroke="white" strokeWidth="3" />
        <text x="204" y="272" fill="white" fontSize="48" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="1">
          GH
        </text>

        {/* Green GHAROWA Banner */}
        <rect x="16" y="306" width="368" height="52" fill="#036937" stroke="white" strokeWidth="4" rx="3" />
        <text x="32" y="345" fill="white" fontSize="42" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="5">
          GHAROWA
        </text>
        
        {/* TM text */}
        <text x="350" y="302" fill="#111827" fontSize="22" fontWeight="bold" fontFamily="Arial, sans-serif">TM</text>
      </svg>
    );
  }

  // Circular Emblem Style (Authentic Default)
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full bg-white border-2 border-amber-400/80 p-1 flex items-center justify-center shrink-0 shadow-md ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* House outline */}
        <path
          d="M 100 24 L 176 86 L 156 86 L 156 148 L 44 148 L 44 86 L 24 86 Z"
          fill="#D92027"
          stroke="#0F172A"
          strokeWidth="4"
        />
        {/* Brick line patterns */}
        <g stroke="white" strokeWidth="2" opacity="0.9">
          <line x1="75" y1="52" x2="125" y2="52" />
          <line x1="55" y1="70" x2="145" y2="70" />
          <line x1="44" y1="88" x2="156" y2="88" />
          <line x1="44" y1="106" x2="156" y2="106" />
          <line x1="44" y1="124" x2="156" y2="124" />
          <line x1="44" y1="142" x2="156" y2="142" />
        </g>
        {/* Door */}
        <rect x="56" y="98" width="30" height="50" fill="#900C19" stroke="white" strokeWidth="2" />
        {/* GH Window */}
        <rect x="98" y="104" width="46" height="32" fill="#900C19" stroke="white" strokeWidth="2" />
        <text x="102" y="128" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif">
          GH
        </text>
        {/* Green Banner */}
        <rect x="18" y="146" width="164" height="28" fill="#036937" stroke="white" strokeWidth="3" rx="2" />
        <text x="30" y="166" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="2">
          GHAROWA
        </text>
      </svg>
    </div>
  );
}
