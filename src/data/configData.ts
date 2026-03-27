import type {ForwardRefExoticComponent, RefAttributes} from "react";
import {BookOpen, ExternalLink, type LucideProps, MessageCircle} from "lucide-react";

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
            { title: "nav.quran", href: "/quran" },
            { title: "nav.books", children: [
                { title: "nav.allBooks", href: "/books", description: "nav.booksDesc" },
                { title: "nav.favorites", href: "/favorites", description: "nav.favoritesDesc" },
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

export const createHelpNavConfig: () => NavItem[] = () => {
    return [
        { Icon: BookOpen, title: "Documentation", href: "/docs" },
        { Icon: MessageCircle, title: "Contact support", href: "/support" },
        { Icon: ExternalLink, title: "What's new", href: "/changelog" },
    ];
}