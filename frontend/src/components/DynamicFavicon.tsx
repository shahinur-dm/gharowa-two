'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function DynamicFavicon() {
  const [faviconUrl, setFaviconUrl] = useState<string>('/favicon.ico');

  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const res: any = await api.get('/settings');
        if (res.success && res.data && res.data.faviconUrl) {
          const url = res.data.faviconUrl;
          setFaviconUrl(url);

          // Update or create favicon link in document head with cache busting
          let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'shortcut icon';
            document.head.appendChild(link);
          }
          link.type = 'image/x-icon';
          link.href = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`;
        }
      } catch (e) {
        // Fallback default
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
