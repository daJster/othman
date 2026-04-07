import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function fullNavigate(to: string) {
    window.location.href = to;
}

export const getHeatmapColor = (value: number) => {
    if (value === 0) return 'bg-green-100';
    if (value < 25) return 'bg-green-200';
    if (value < 50) return 'bg-green-400';
    if (value < 75) return 'bg-green-600';
    return 'bg-green-800';
};

export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}