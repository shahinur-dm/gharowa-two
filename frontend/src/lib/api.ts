const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiClient {
  private inFlightRequests = new Map<string, Promise<any>>();
  private memoryCache = new Map<string, CacheItem<any>>();
  private CACHE_TTL = 3000; // 3 seconds client-side cache for deduplication & fast renders

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('gharowa_cms_updated', () => this.clearCache());
    }
  }

  clearCache() {
    this.memoryCache.clear();
    this.inFlightRequests.clear();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('gharowa_admin_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        cache: 'no-store',
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err: any) {
      console.warn(`[API] Request to ${endpoint} failed:`, err);
      if (err.name === 'TypeError' || err.message?.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw err;
    }
  }

  get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const cacheKey = `GET:${url}`;

    // 1. Return from memory cache if fresh (prevents duplicate simultaneous requests from multiple components)
    const cached = this.memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return Promise.resolve(cached.data);
    }

    // 2. Deduplicate identical concurrent in-flight requests
    if (this.inFlightRequests.has(cacheKey)) {
      return this.inFlightRequests.get(cacheKey)!;
    }

    const promise = this.request<T>(url, { method: 'GET' })
      .then((data) => {
        this.memoryCache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      })
      .finally(() => {
        this.inFlightRequests.delete(cacheKey);
      });

    this.inFlightRequests.set(cacheKey, promise);
    return promise;
  }

  post<T = any>(endpoint: string, body?: any): Promise<T> {
    this.clearCache();
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(endpoint: string, body?: any): Promise<T> {
    this.clearCache();
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = any>(endpoint: string, body?: any): Promise<T> {
    this.clearCache();
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(endpoint: string): Promise<T> {
    this.clearCache();
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
