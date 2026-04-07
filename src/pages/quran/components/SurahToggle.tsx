import React from 'react';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useQuranReader } from '@/hooks/use-quran-reader';
import { type SurahMetadata } from '@/providers/contexts/quran-reader-context';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import { capitalizeFirst } from '@/lib/utils';

interface SurahToggleProps {
    surah: SurahMetadata;
    surahKey: string;
}

const SurahToggle: React.FC<SurahToggleProps> = ({ surah, surahKey }) => {
    const { nav } = useQuranReader();
    const isActive = nav?.currentSurah === parseInt(surahKey, 10);
    const surahNumber = parseInt(surahKey, 10);
    const { toggleSidebar } = useSidebar();

    const handleClick = () => {
        if (nav?.goToSurah) {
            nav.goToSurah(surahNumber);
        }
        toggleSidebar()
    };

    return (
        <SidebarMenuItem className='w-full'>
            <SidebarMenuButton
                isActive={isActive}
                onClick={handleClick}
                className="flex items-center justify-between w-full p-4 py-7 border border-neutral-200/50"
            >
                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{surah.name}</span>
                    <span className="text-xs text-muted-foreground">
                        {surah.name_en} • {capitalizeFirst(surah.location)} • {surah.number_of_ayat} ayah
                    </span>
                </div>
                <SquareArrowOutUpRightIcon className="size-4" />
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

export default SurahToggle;
