export const CDN_BASE_URL = 'https://cdn.kuttab-othman.workers.dev';
export const ALQURAN_API_BASE_URL = 'https://api.alquran.cloud';
export const ALQURAN_CDN_BASE_URL = 'https://cdn.islamic.network';
export const QURAN_METADATA_URL = `${CDN_BASE_URL}/quran.json`;
export const QURANPEDIA_BASE_URL = 'https://api.quranpedia.net';
export const MAX_ABSOLUTE_AYAH_NUMBER = 6236;

export const isAyahNumberValid = (n: number): boolean =>
  n >= 1 && n <= MAX_ABSOLUTE_AYAH_NUMBER;

export const AUDIO_QUALITIES = [192, 128, 64, 48, 40, 3];
