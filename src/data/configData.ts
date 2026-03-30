import type {ForwardRefExoticComponent, RefAttributes} from "react";
import {BookOpen, CircleQuestionMarkIcon, ExternalLink, type LucideProps, MessageCircle} from "lucide-react";

export interface NavItem {
    title: string
    href?: string
    Icon?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    description?: string
    children?: { title: string; href: string; description?: string }[]
    badge?: string
}

export interface NavConfig {
    guest: NavItem[]
    user: NavItem[]
    admin: NavItem[]
    superadmin: NavItem[]
}

export const createDefaultNavConfig: () => NavConfig = () => {
    return {
        guest: [
            { title: "nav.home", href: "/" },
            { title: "nav.meetings", href: "/kuttab" },
            { title: "nav.books", children: [
                { title: "nav.quran.hafs", href: "/quran/hafs", description: "nav.quran.hafsDesc" },
                { title: "nav.quran.warsh", href: "/quran/warsh", description: "nav.quran.warshDesc" },
            ]},
        ],
        user: [
            { title: "nav.profile", href: "/profile" },
        ],
        admin: [
            { title: "nav.admin", children: [
                { title: "nav.dashboard", href: "/admin/dashboard", description: "nav.dashboardDesc" },
                { title: "nav.users", href: "/admin/users", description: "nav.usersDesc" },
                { title: "nav.content", href: "/admin/content", description: "nav.contentDesc" },
            ]},
        ],
        superadmin: [
            { title: "nav.superAdmin", children: [
                { title: "nav.settings", href: "/superadmin/settings", description: "nav.settingsDesc" },
                { title: "nav.analytics", href: "/superadmin/analytics", description: "nav.analyticsDesc" },
            ]},
        ],
    }
}

export const createHelpNavConfig: () => NavItem = () => {
    return {
        Icon: CircleQuestionMarkIcon,
        title: "help & documentation",
        children : [
            {
                Icon: BookOpen,
                title: "help.doc",
                href: "/docs"
            },
            {
                Icon: MessageCircle,
                title: "help.contact",
                href: "/support"
            },
            {
                Icon: ExternalLink,
                title: "help.news",
                href: "/changelog"
            },
        ]
    };
}

export const createPhoneExtensionList = () => {
    return [
        {
            name: "France",
            iso: "FR",
            dialCode: "+33",
            flag: "🇫🇷",
        },
        {
            name: "Morocco",
            iso: "MA",
            dialCode: "+212",
            flag: "🇲🇦",
        }
    ];
}