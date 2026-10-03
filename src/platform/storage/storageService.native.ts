import AsyncStorage from '@react-native-async-storage/async-storage';
import { type StorageKey, type StorageService } from './storage.types';

export const storageService: StorageService = {
  async getItem<T>(key: StorageKey, fallback: T): Promise<T> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[storage:native] getItem failed for key "${key}":`, error);
      return fallback;
    }
  },

  async setItem<T>(key: StorageKey, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[storage:native] setItem failed for key "${key}":`, error);
      return false;
    }
  },

  async removeItem(key: StorageKey): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[storage:native] removeItem failed for key "${key}":`, error);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.warn('[storage:native] clear failed:', error);
      return false;
    }
  },
};
