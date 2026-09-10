// Centralized In-Memory Cache Manager for Next.js App Router Route Handlers

let cachedSettings: any = null;
let settingsFetchTime = 0;
const SETTINGS_TTL_MS = 5000;

export function getCachedSettings() {
  const now = Date.now();
  if (cachedSettings && now - settingsFetchTime < SETTINGS_TTL_MS) {
    return cachedSettings;
  }
  return null;
}

export function setCachedSettings(settings: any) {
  cachedSettings = settings;
  settingsFetchTime = Date.now();
}

export function invalidateSettingsCache() {
  cachedSettings = null;
  settingsFetchTime = 0;
}

let cachedMenuItems: any[] | null = null;
let menuItemsFetchTime = 0;
const MENU_TTL_MS = 5000;

export function getCachedMenuItems() {
  const now = Date.now();
  if (cachedMenuItems && now - menuItemsFetchTime < MENU_TTL_MS) {
    return cachedMenuItems;
  }
  return null;
}

export function setCachedMenuItems(items: any[]) {
  cachedMenuItems = items;
  menuItemsFetchTime = Date.now();
}

export function invalidateMenuItemsCache() {
  cachedMenuItems = null;
  menuItemsFetchTime = 0;
}
