import { type StorageKey, type StorageService } from './storage.types';

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const storageService: StorageService = {
  async getItem<T>(key: StorageKey, fallback: T): Promise<T> {
    try {
      if (!isLocalStorageAvailable()) return fallback;
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[storage:web] getItem failed for key "${key}":`, error);
      return fallback;
    }
  },

  async setItem<T>(key: StorageKey, value: T): Promise<boolean> {
    try {
      if (!isLocalStorageAvailable()) return false;
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[storage:web] setItem failed for key "${key}":`, error);
      return false;
    }
  },

  async removeItem(key: StorageKey): Promise<boolean> {
    try {
      if (!isLocalStorageAvailable()) return false;
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[storage:web] removeItem failed for key "${key}":`, error);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      if (!isLocalStorageAvailable()) return false;
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.warn('[storage:web] clear failed:', error);
      return false;
    }
  },
};
