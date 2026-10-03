export const STORAGE_KEYS = {
  language: 'language',
  theme: 'theme',
  quranEdition: 'quranreader:edition',
  lastVisitedPage: 'lastVisitedPage',
  sidebarState: 'sidebar_state',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export interface StorageService {
  getItem<T>(key: StorageKey, fallback: T): Promise<T>;
  setItem<T>(key: StorageKey, value: T): Promise<boolean>;
  removeItem(key: StorageKey): Promise<boolean>;
  clear(): Promise<boolean>;
}
