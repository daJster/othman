/**
 * Shapes shared by more than one config table.
 *
 * This layer must stay runtime-agnostic (see the layering rules in
 * eslint.config.js): no React, no react-native, no DOM. Icons are therefore
 * declared as string keys rather than components — the presentation layer owns
 * the key -> component registry and can resolve each key to a different set of
 * icons per platform.
 */

/**
 * Logical icon names used across config data.
 *
 * A UI layer supplies the implementation once:
 *
 *   const icons = {
 *     'book-open': BookOpen,
 *     chart: ChartLine,
 *     ...
 *   } satisfies IconRegistry<LucideIcon>;
 *
 * `IconRegistry` makes that object exhaustively checked: renaming a key here
 * breaks the registry at compile time instead of rendering a blank icon.
 */
export type IconName =
  | 'book-open'
  | 'chart-line'
  | 'check-circle'
  | 'cog'
  | 'external-link'
  | 'file-text'
  | 'megaphone'
  | 'trash'
  | 'university'
  | 'video';

/** Component type for an icon registry, kept platform-agnostic. */
export type IconRegistry<Component> = Readonly<Record<IconName, Component>>;

export type NavVariant = 'default' | 'destructive';

/**
 * A navigation entry.
 *
 * `title` is copied verbatim from the source data, so some entries are literal
 * display text (`ٱلْقُرْآنُ ٱلْكَرِيمُ`) and others are i18n keys (`nav.admin`).
 * Resolve with `t(item.title, item.title)` once i18n is wired up.
 */
export type NavItem = {
  readonly title: string;
  readonly href?: string;
  readonly icon?: IconName;
  /** Translation key, not display text. */
  readonly descriptionKey?: string;
  readonly children?: readonly NavItem[];
  readonly badge?: string;
  readonly variant?: NavVariant;
};

/** Semantic colour intent. The literal classes live in `tokens.ts`. */
export type StatusTone = 'positive' | 'info' | 'neutral';

export type MeetingStatusConfig = {
  readonly label: string;
  readonly tone: StatusTone;
  /** Render the status dot with a pulse, to signal urgency. */
  readonly pulse: boolean;
};

/** Avatar scale for the attendee stack. */
export type AttendeeSize = 'sm';

export type AttendeeListConfig = {
  /** Avatars shown before collapsing the rest into a counter. */
  readonly maxVisible: number;
  readonly avatarSize: AttendeeSize;
  /** Contrast ring drawn against the surrounding surface. */
  readonly bordered: boolean;
  readonly interactive: boolean;
};

export type PhoneExtension = {
  readonly name: string;
  /** ISO 3166-1 alpha-2. Doubles as the table key. */
  readonly iso: string;
  readonly dialCode: string;
  readonly flag: string;
};
