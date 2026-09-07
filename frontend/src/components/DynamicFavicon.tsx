'use client';

import { useEffect } from 'react';
import { api } from '../lib/api';

export default function DynamicFavicon() {
  useEffect(() => {
    const applyFavicon = (url: string) => {
      if (!url || typeof document === 'undefined') return;

      const cacheBustedUrl = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`;

      // 1. Update or create standard icon and shortcut icon
      const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];

      rels.forEach((rel) => {
        let link: HTMLLinkElement | null = document.querySelector(`link[rel='${rel}']`);
        if (!link) {
          link = document.createElement('link');
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = cacheBustedUrl;
      });
    };

    const updateFavicon = async () => {
      try {
        const res: any = await api.get('/settings');
        if (res.success && res.data && res.data.faviconUrl) {
          applyFavicon(res.data.faviconUrl);
        }
      } catch (e) {
        // Silent fallback
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
