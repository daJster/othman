import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';
import { SettingsIcon } from 'lucide-react';
import { useQuranReader } from '@/hooks/use-quran-reader';
import SurahToggle from './SurahToggle';
import ExitToggle from './ExitToggle';
import EditionsDropdown from './EditionsDropdown';
import { Separator } from '@/components/ui/separator';

export interface QuranReaderSidebarProps {
    title?: string;
    showCloseButton?: boolean;
    variant?: 'sidebar' | 'floating';
}

const QuranReaderSidebar: React.FC<QuranReaderSidebarProps> = ({
    title = '',
    variant = 'sidebar',
}) => {
    const maxTitleLength = 20;
    const isLong = title.length > maxTitleLength;
    const { metadata } = useQuranReader();

    const metadataEntries = metadata ? Object.entries(metadata) : [];

    return (
        <div className="absolute top-0 left-0 min-h-screen">
            <Sidebar
                variant={variant}
                className={cn(
                    'absolute h-full w-full duration-400 ease-in-out'
                )}
            >
                <SidebarContent className="flex flex-col justify-between h-full dark:bg-green-800/30">
                    <SidebarGroup className="flex flex-col gap-2">
                        <SidebarGroupLabel className="flex flex-row justify-between w-full">
                            {isLong ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="text-lg font-bold text-black dark:text-white cursor-pointer">
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
                        <ExitToggle />

                        <Separator className='my-3'/>

                        <EditionsDropdown />

                        <Separator className='my-3'/>

                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col items-center w-full gap-2">
                                {metadataEntries.map(([key, surah]) => (
                                    <SurahToggle
                                        key={key}
                                        surahKey={key}
                                        surah={surah}
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarFooter className="flex flex-row justify-between py-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() =>
                                        (window.location.href =
                                            '/quran/settings')
                                    }
                                    className="flex items-center justify-center px-2 gap-2 text-neutral-800 dark:text-white"
                                >
                                    <SettingsIcon className="h-5 w-5" />
                                    <p>Settings</p>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>Settings</p>
                            </TooltipContent>
                        </Tooltip>
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
        </div>
    );
};

export default QuranReaderSidebar;
