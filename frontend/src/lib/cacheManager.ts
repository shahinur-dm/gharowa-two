// Centralized High-Performance In-Memory Cache Manager for Next.js App Router Route Handlers
// Provides near-zero-latency (1-5ms) response times for public GET requests
// with INSTANT invalidation whenever an Admin adds, updates, or deletes records.

const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds TTL

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string, ttlMs: number = DEFAULT_TTL_MS): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  invalidate(keyPattern?: string): void {
    if (!keyPattern) {
      this.cache.clear();
      return;
    }
    this.cache.forEach((_, key) => {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    });
  }
}

const globalCache: CacheManager = (global as any).__gharowa_cache || new CacheManager();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__gharowa_cache = globalCache;
}

// Settings Cache
export const getCachedSettings = () => globalCache.get<any>('settings');
export const setCachedSettings = (data: any) => globalCache.set('settings', data);
export const invalidateSettingsCache = () => globalCache.invalidate('settings');

// Menu Items Cache
export const getCachedMenuItems = (key: string = 'all') => globalCache.get<any[]>(`menu_items_${key}`);
export const setCachedMenuItems = (data: any[], key: string = 'all') => globalCache.set(`menu_items_${key}`, data);
export const invalidateMenuItemsCache = () => globalCache.invalidate('menu_items');

// Categories Cache
export const getCachedCategories = () => globalCache.get<any[]>('categories');
export const setCachedCategories = (data: any[]) => globalCache.set('categories', data);
export const invalidateCategoriesCache = () => globalCache.invalidate('categories');

// Hero Slides Cache
export const getCachedHeroSlides = () => globalCache.get<any[]>('hero_slides');
export const setCachedHeroSlides = (data: any[]) => globalCache.set('hero_slides', data);
export const invalidateHeroSlidesCache = () => globalCache.invalidate('hero_slides');

// Customer Reviews Cache
export const getCachedReviews = () => globalCache.get<any[]>('reviews');
export const setCachedReviews = (data: any[]) => globalCache.set('reviews', data);
export const invalidateReviewsCache = () => globalCache.invalidate('reviews');

// Brand Partners Cache
export const getCachedBrands = () => globalCache.get<any[]>('brands');
export const setCachedBrands = (data: any[]) => globalCache.set('brands', data);
export const invalidateBrandsCache = () => globalCache.invalidate('brands');

// Blog Videos Cache
export const getCachedBlogs = () => globalCache.get<any[]>('blogs');
export const setCachedBlogs = (data: any[]) => globalCache.set('blogs', data);
export const invalidateBlogsCache = () => globalCache.invalidate('blogs');

// Invalidate everything
export const invalidateAllCaches = () => globalCache.invalidate();
