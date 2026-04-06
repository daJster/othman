import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn, getHeatmapColor } from '@/lib/utils';
import type { SurahCell } from '../types';

type HeatmapCellProps = {
    surah: SurahCell;
    isSelected: boolean;
    onClick: () => void;
};

export function HeatmapCell({ surah, isSelected, onClick }: HeatmapCellProps) {
    const getTextColor = (progress: number) => {
        if (progress < 50) return 'text-green-800 dark:text-green-900';
        return 'text-white';
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        onClick={onClick}
                        className={cn(
                            'aspect-square rounded m-1 border dark:border-neutral-200/40 cursor-pointer flex items-center justify-center text-[15px] font-medium',
                            getHeatmapColor(surah.progress),
                            getTextColor(surah.progress),
                            isSelected &&
                                'ring-1 dark:ring-green-300 ring-green-900'
                        )}
                    >
                        {surah.id}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-sm">
                        {surah.name} - {surah.progress}% complete
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
