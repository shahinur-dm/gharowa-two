'use client';

import { useEffect } from 'react';
import { api } from '../lib/api';

export default function DynamicFavicon() {
  useEffect(() => {
    const applyFavicon = (rawUrl: string) => {
      if (!rawUrl || typeof document === 'undefined') return;

      let targetUrl = rawUrl.trim();

      // Only append cache-busting timestamp to HTTP/HTTPS URLs (NOT data: base64 URLs)
      if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
        targetUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
      }

      // Determine MIME type
      let mimeType = 'image/png';
      if (targetUrl.startsWith('data:')) {
        const match = targetUrl.match(/^data:([^;]+);/);
        if (match) mimeType = match[1];
      } else if (targetUrl.endsWith('.ico')) {
        mimeType = 'image/x-icon';
      } else if (targetUrl.endsWith('.svg')) {
        mimeType = 'image/svg+xml';
      } else if (targetUrl.endsWith('.jpg') || targetUrl.endsWith('.jpeg')) {
        mimeType = 'image/jpeg';
      }

      // Safely update existing icon links without removing DOM elements from React's tree
      const existingIcons = document.querySelectorAll("link[rel*='icon'], link[rel*='apple-touch-icon']");
      if (existingIcons.length > 0) {
        existingIcons.forEach((el) => {
          (el as HTMLLinkElement).href = targetUrl;
          if (mimeType) (el as HTMLLinkElement).type = mimeType;
        });
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = mimeType;
        link.href = targetUrl;
        document.head.appendChild(link);
      }
    };

    const updateFavicon = async () => {
      try {
        const res: any = await api.get('/settings');
        if (res.success && res.data && res.data.faviconUrl) {
          applyFavicon(res.data.faviconUrl);
        } else {
          // If no custom favicon is saved, point to dynamic favicon endpoint
          applyFavicon('/api/favicon');
        }
      } catch (e) {
        applyFavicon('/api/favicon');
      }
    };

    updateFavicon();

    if (typeof window !== 'undefined') {
      window.addEventListener('gharowa_cms_updated', updateFavicon);
      return () => window.removeEventListener('gharowa_cms_updated', updateFavicon);
    }
  }, []);

  return null;
}
