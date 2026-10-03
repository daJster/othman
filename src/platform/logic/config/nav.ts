/**
 * Navigation trees.
 *
 * Icons are `IconName` string keys, not components — see `types.ts`. The
 * presentation layer resolves them through an `IconRegistry`, which lets web
 * and native ship different icon sets for the same config.
 */

import type { UserRole } from '../types';
import type { NavItem } from './types';
import { defineConfig, defineTable } from './primitives';

/**
 * Roles with a dedicated side menu. `'user'` is absent on purpose and inherits
 * the guest tree via {@link ROLE_NAV_CONFIG}'s fallback.
 */
export type RoleNavId = 'guest' | 'admin' | 'superadmin';

const roleNavRows: Record<RoleNavId, readonly NavItem[]> = {
  guest: [
    {
      title: 'ٱلْقُرْآنُ ٱلْكَرِيمُ',
      href: '/quran',
      icon: 'book-open',
      descriptionKey: 'nav.quranDesc',
    },
  ],
  admin: [
    {
      title: 'nav.admin',
      children: [
        {
          title: 'nav.dashboard',
          href: '/admin/dashboard',
          descriptionKey: 'nav.dashboardDesc',
        },
        {
          title: 'nav.users',
          href: '/admin/users',
          descriptionKey: 'nav.usersDesc',
        },
        {
          title: 'nav.content',
          href: '/admin/content',
          descriptionKey: 'nav.contentDesc',
        },
      ],
    },
  ],
  superadmin: [
    {
      title: 'nav.superAdmin',
      children: [
        {
          title: 'nav.settings',
          href: '/superadmin/settings',
          descriptionKey: 'nav.settingsDesc',
        },
        {
          title: 'nav.analytics',
          href: '/superadmin/analytics',
          descriptionKey: 'nav.analyticsDesc',
        },
      ],
    },
  ],
};

/**
 * Side-menu contents per role.
 *
 * Resolved rather than keyed: `get` falls back to the guest tree, which is what
 * `navConfig[role] || navConfig.guest` did by hand before.
 */
export const ROLE_NAV_CONFIG = defineTable(roleNavRows).withDefault('guest');

/** Groups rendered by the account settings screen, in display order. */
export const ACCOUNT_SETTINGS_NAV = defineConfig<readonly (readonly NavItem[])[]>([
  [
    { title: 'Meetings', href: '/my-meetings', icon: 'video' },
    { title: 'Classroom', href: '/my-classroom', icon: 'university' },
    { title: 'Tasks', href: '/tasks', icon: 'check-circle' },
    { title: 'Progress', href: '/account/progress', icon: 'chart-line' },
  ],
  [
    {
      title: 'Notifications',
      href: '/account/notifications',
      icon: 'megaphone',
    },
    { title: 'About', href: '/account/settings/about', icon: 'book-open' },
    { title: 'Terms & Conditions', href: '/t&c', icon: 'file-text' },
    {
      title: 'Third-Party Services',
      href: '/account/settings/third-party-services',
      icon: 'external-link',
    },
  ],
  [{ title: 'Set Preferences', href: '/account', icon: 'cog' }],
  [
    {
      title: 'delete account',
      href: '/account/settings/delete',
      icon: 'trash',
      variant: 'destructive',
    },
  ],
]);

/** True when the role has a side menu of its own rather than the guest tree. */
export function hasDedicatedRoleNav(role: UserRole): role is RoleNavId {
  return ROLE_NAV_CONFIG.has(role);
}
