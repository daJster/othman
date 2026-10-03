import type { Meeting } from '@/core/types';

const MAX_CACHE_SIZE = 24;

export const meetingsCache = new Map<string, Meeting[]>();

export function getMeetingsFromCache(dateKey: string): Meeting[] | undefined {
  return meetingsCache.get(dateKey);
}

export function setMeetingsCache(dateKey: string, meetings: Meeting[]): void {
  if (meetingsCache.has(dateKey)) {
    meetingsCache.set(dateKey, meetings);
    return;
  }

  if (meetingsCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = meetingsCache.keys().next().value as string | undefined;
    if (oldestKey !== undefined) {
      meetingsCache.delete(oldestKey);
    }
  }

  meetingsCache.set(dateKey, meetings);
}

export function clearMeetingsCache(): void {
  meetingsCache.clear();
}
