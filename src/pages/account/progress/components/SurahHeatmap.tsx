import { HeatmapCell } from './HeatmapCell';
import type { SurahCell } from '../types';

const surahProgress: SurahCell[] = Array.from({ length: 114 }, (_, i) => ({
    id: i + 1,
    name: `Surah ${i + 1}`,
    progress: Math.floor(Math.random() * 101),
}));

type SurahHeatmapProps = {
    selectedSurah: number | null;
    onSelect: (surahId: number) => void;
};

export function SurahHeatmap({ selectedSurah, onSelect }: SurahHeatmapProps) {
    return (
        <div className="grid grid-cols-5 w-full">
            {surahProgress.map((surah) => (
                <HeatmapCell
                    key={surah.id}
                    surah={surah}
                    isSelected={selectedSurah === surah.id}
                    onClick={() => onSelect(surah.id)}
                />
            ))}
        </div>
    );
}
