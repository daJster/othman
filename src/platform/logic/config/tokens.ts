/**
 * Literal class strings, kept in one auditable file.
 *
 * Two reasons these do not live inline in the config tables:
 *
 *  1. Tailwind's scanner only sees class names that appear as complete string
 *     literals. Centralising them keeps the emitted CSS in sync and makes a
 *     rename a single-file change.
 *  2. The config tables describe *intent* (`tone: 'positive'`, `bordered:
 *     true`); this file is the single place where intent is bound to a
 *     concrete visual treatment.
 *
 * Swapping the styling system (NativeWind, Tamagui, ...) means rewriting this
 * file only — the config tables and their types stay untouched.
 */

import type { AttendeeSize, StatusTone } from './types';
import { defineConfig } from './primitives';

/** Badge surface + text for a meeting status. */
export const TONE_BADGE_CLASSES = defineConfig({
  positive:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  info:
    'bg-blue-100 text-blue-700 dark:bg-neutral-950 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800',
  neutral:
    'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 border-slate-200 dark:border-neutral-700',
} satisfies Readonly<Record<StatusTone, string>>);

/** Status dot colour per tone. */
export const TONE_DOT_CLASSES = defineConfig({
  positive: 'bg-emerald-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
} satisfies Readonly<Record<StatusTone, string>>);

/** Applied on top of `TONE_DOT_CLASSES` when the status is pulsing. */
export const TONE_DOT_PULSE_CLASS = 'animate-pulse';

export const ATTENDEE_AVATAR_SIZE_CLASSES = defineConfig({
  sm: 'h-6 w-6',
} satisfies Readonly<Record<AttendeeSize, string>>);

export const ATTENDEE_AVATAR_BORDER_CLASS =
  'border-2 border-white dark:border-neutral-900';

export const ATTENDEE_AVATAR_INTERACTION_CLASSES = defineConfig({
  static: 'ring-0 cursor-default',
  interactive: 'cursor-pointer ring-2 ring-offset-2 ring-offset-transparent',
});

export const ATTENDEE_FALLBACK_CLASS =
  'text-[9px] font-semibold bg-slate-200 dark:bg-neutral-700 text-neutral-600 dark:text-slate-300';

export const ATTENDEE_OVERFLOW_CLASS =
  'flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-neutral-900 bg-slate-100 dark:bg-neutral-700 text-[9px] font-semibold text-slate-500 dark:text-slate-400';
