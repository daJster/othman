import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
    BookOpen,
    CircleQuestionMarkIcon,
    ExternalLink,
    type LucideProps,
    MessageCircle,
    CheckCircle2,
    Trash2,
    FileText,
    Megaphone,
    ChartLine,
} from 'lucide-react';

export type NavItemVariant = 'default' | 'destructive';

export interface NavItem {
    title: string;
    href?: string;
    Icon?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    description?: string;
    children?: NavItem[];
    badge?: string;
    variant?: NavItemVariant;
}

export interface NavConfig {
    guest: NavItem[];
    user: NavItem[];
    admin: NavItem[];
    superadmin: NavItem[];
}

export const createDefaultNavConfig: () => NavConfig = () => {
    return {
        guest: [
            { title: 'nav.home', href: '/' },
            { title: 'nav.meetings', href: '/kuttab' },
            {
                title: 'nav.quran.warsh',
                href: '/quran/warsh',
                description: 'nav.quran.warshDesc',
            },
        ],
        user: [{ title: 'nav.profile', href: '/profile' }],
        admin: [
            {
                title: 'nav.admin',
                children: [
                    {
                        title: 'nav.dashboard',
                        href: '/admin/dashboard',
                        description: 'nav.dashboardDesc',
                    },
                    {
                        title: 'nav.users',
                        href: '/admin/users',
                        description: 'nav.usersDesc',
                    },
                    {
                        title: 'nav.content',
                        href: '/admin/content',
                        description: 'nav.contentDesc',
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
                        description: 'nav.settingsDesc',
                    },
                    {
                        title: 'nav.analytics',
                        href: '/superadmin/analytics',
                        description: 'nav.analyticsDesc',
                    },
                ],
            },
        ],
    };
};

export const createHelpNavConfig: () => NavItem = () => {
    return {
        Icon: CircleQuestionMarkIcon,
        title: 'help & documentation',
        children: [
            {
                Icon: BookOpen,
                title: 'help.doc',
                href: '/docs',
            },
            {
                Icon: MessageCircle,
                title: 'help.contact',
                href: '/support',
            },
            {
                Icon: ExternalLink,
                title: 'help.news',
                href: '/changelog',
            },
        ],
    };
};

export const createPhoneExtensionList = () => {
    return [
        {
            name: 'France',
            iso: 'FR',
            dialCode: '+33',
            flag: '🇫🇷',
        },
        {
            name: 'Morocco',
            iso: 'MA',
            dialCode: '+212',
            flag: '🇲🇦',
        },
    ];
};

export const createMeetingStatusConfig = () => {
    return {
        soon: {
            label: 'Starting soon',
            classes:
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
            dot: 'bg-emerald-500 animate-pulse',
        },
        upcoming: {
            label: 'Today',
            classes:
                'bg-blue-100 text-blue-700 dark:bg-neutral-950 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800',
            dot: 'bg-blue-500',
        },
        scheduled: {
            label: 'Scheduled',
            classes:
                'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 border-slate-200 dark:border-neutral-700',
            dot: 'bg-slate-400',
        },
    };
};

export const createAttendeeListConfig = () => {
    return {
        maxVisible: 4,
        avatarSize: 'h-6 w-6',
        avatarBorder: 'border-2 border-white dark:border-neutral-900',
        avatarRing: 'ring-0 cursor-default',
        fallbackClass:
            'text-[9px] font-semibold bg-slate-200 dark:bg-neutral-700 text-neutral-600 dark:text-slate-300',
        extraCountClass:
            'flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-neutral-900 bg-slate-100 dark:bg-neutral-700 text-[9px] font-semibold text-slate-500 dark:text-slate-400',
    };
};

export const createAccountSettingsNavConfig: () => NavItem[][] = () => {
    return [
        [
            {
                title: 'Tasks',
                href: '/tasks',
                Icon: CheckCircle2,
            },
            {
                title: 'Progress',
                href: '/account/progress',
                Icon: ChartLine,
            },
        ],
        [
            {
                title: 'Notifications',
                href: '/account/notifications',
                Icon: Megaphone,
            },
            {
                title: 'About',
                href: '/account/settings/about',
                Icon: BookOpen,
            },
            {
                title: 'Terms & Conditions',
                href: '/account/settings/t&c',
                Icon: FileText,
            },
            {
                title: 'Third-Party Services',
                href: '/account/settings/third-party-services',
                Icon: ExternalLink,
            },
        ],
        [
            {
                title: 'delete account',
                href: '/account/settings/delete',
                Icon: Trash2,
                variant: 'destructive',
            },
        ],
    ];
};
