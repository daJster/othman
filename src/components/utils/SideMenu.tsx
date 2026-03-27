import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarFooter,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import type {NavItem} from "@/data/configData.ts";
import React from "react";
import {HelpSection, NavItemRow} from "@/components/utils/SideMenuUtils.tsx";

export interface SidebarWrapperProps {
    title?: string
    navItems?: NavItem[]
    showCloseButton?: boolean
    variant?: 'sidebar' | 'floating'
    className?: string
}

const SideMenu: React.FC<SidebarWrapperProps> = ({
    title = '',
    navItems = [],
    variant = 'floating',
    className = '',
}) => {
    const maxTitleLength = 20
    const isLong = title.length > maxTitleLength

    return (
        <div
            className={`absolute top-15 left-0 h-full  transition-all border-none duration-300 ease-in-out ${className}`}
        >
            <Sidebar
                variant={variant}
                className={cn(
                    'relative w-full h-full p-2 duration-400 ease-in-out'
                )}
            >
                <SidebarContent className="h-full dark:bg-green-800/30">
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex flex-row justify-between w-full">
                            {isLong ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="text-lg font-bold text-black dark:text-white">
                                            {title.slice(0, maxTitleLength)}...
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <span className="text-lg font-bold text-black dark:text-white">
                                    {title}
                                </span>
                            )}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <NavItemRow item={item} />
                                ))}
                                <HelpSection />
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarFooter>
                        logout
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
        </div>
    )
}

export default SideMenu
