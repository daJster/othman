/**
 * Meeting presentation config.
 *
 * Both tables here describe how a status or an attendee stack looks, not how
 * it behaves. The config carries intent (`tone`, `bordered`); `tokens.ts` owns
 * the class strings that render it.
 */

import type { MeetingStatus } from '../types';
import type { AttendeeListConfig, MeetingStatusConfig } from './types';
import { defineConfig, defineTable } from './primitives';

/**
 * Status keys are checked against `MeetingStatus`, so adding a status to
 * `logic/types` without adding it here is a compile error.
 */
export const MEETING_STATUS_CONFIG = defineTable({
  soon: { label: 'Starting soon', tone: 'positive', pulse: true },
  upcoming: { label: 'Today', tone: 'info', pulse: false },
  scheduled: { label: 'Scheduled', tone: 'neutral', pulse: false },
} satisfies Record<MeetingStatus, MeetingStatusConfig>);

export const ATTENDEE_LIST_CONFIG = defineConfig({
  maxVisible: 4,
  avatarSize: 'sm',
  bordered: true,
  interactive: false,
} satisfies AttendeeListConfig);

/**
 * Status lookup, replacing the old `createMeetingStatusConfig()[status]`
 * pattern that rebuilt the whole table to read one entry.
 */
export function getMeetingStatusConfig(
  status: MeetingStatus,
): MeetingStatusConfig {
  return MEETING_STATUS_CONFIG.get(status);
}
