import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    HelpCircle,
} from "lucide-react";
import {createHelpNavConfig, type NavItem} from "@/data/configData.ts";
import {NavLink} from "react-router-dom";


/** Recursive nav item — renders a collapsible if it has children */
export const NavItemRow = ({
    item
}: {
    item: NavItem;
})=> {
    const [open, setOpen] = useState(false);

    const renderNavItem = (item: NavItem) => {
        const commonClasses = `flex items-center gap-2`

        if (item.href) {
            return (
                <NavLink
                    to={item.href}
                    end
                >
                    {item.Icon && <item.Icon className={'w-4 h-4'} />}
                    <span>{item.title}</span>
                    {item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {item.badge}
                        </span>
                    )}
                </NavLink>
            )
        }

        if (item.href) {
            return (
                <a
                    href={item.href}
                    className={`${commonClasses} w-full text-left`}
                >
                    {item.Icon && <item.Icon className={'w-4 h-4'} />}
                    <span>{item.title}</span>
                    {item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {item.badge}
                        </span>
                    )}
                </a>
            )
        }

        return null
    }

    if (item.children?.length) {
        return (
            <Collapsible open={open} onOpenChange={setOpen} className="w-full">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between group">
                        <span className="flex items-center gap-2">
                            {item.Icon && <item.Icon className="w-3.5 h-3.5"/>}
                            {item.title}
                        </span>
                        <ChevronDown
                            className={cn(
                                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                                open && "rotate-180"
                            )}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 mt-0.5 space-y-0.5 border-l border-green-200 ml-3">
                    {item.children.map((child) => (
                        <SidebarMenuItem key={child.title}>
                            <NavItemRow item={child} />
                        </SidebarMenuItem>
                    ))}
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuButton asChild>
            {renderNavItem ? renderNavItem(item) : <a href={item.href}>{item.title}</a>}
        </SidebarMenuButton>
    );
}

/** Help collapsible section */
export const HelpSection = () => {
    const [open, setOpen] = useState(false);
    const helpNavConfig = createHelpNavConfig()

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-between h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            Help & resources
          </span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-0.5">
                {helpNavConfig.map((item) => (
                    <a
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                        {item.Icon && <item.Icon className="w-3.5 h-3.5"/>}
                        {item.title}
                    </a>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}