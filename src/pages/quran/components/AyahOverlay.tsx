import { createQuranPageScaleConfig } from '@/data/configData';
import { useQuranReader } from '@/hooks/use-quran-reader';
import type { EditionBboxesReversed } from '@/providers';

export interface Ayah {
    pageKey: number;
    ayahKey: string;
    surah: number;
    absoluteNumber: number;
}

interface AyahOverlayProps {
    pageKey: number;
    ayat: EditionBboxesReversed[string]['ayat'];
    selectedAyahKey: string | null;
    onAyahSelect: (ayah: Ayah) => void;
}

export function AyahOverlay({
    pageKey,
    ayat,
    selectedAyahKey,
    onAyahSelect,
}: AyahOverlayProps) {
    const { selectedEdition } = useQuranReader();
    const quranPageScaleConfig = createQuranPageScaleConfig();

    const pageSize = selectedEdition
        ? quranPageScaleConfig[selectedEdition.name]?.size
        : null;

    const pageScaleKey =
        selectedEdition &&
        quranPageScaleConfig[selectedEdition.name].pages?.[pageKey]
            ? pageKey
            : 'default';

    const { scaleX, scaleY, offsetX, offsetY } = selectedEdition
        ? quranPageScaleConfig[selectedEdition.name].pages[pageScaleKey]
        : { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 }; // falback

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                height: pageSize?.height,
                width: pageSize?.width,
            }}
        >
            {Object.entries(ayat).map(([ayahKey, ayah]) =>
                ayah.bboxes.map((bbox, bboxIdx) => {
                    const left = bbox.left * scaleX + offsetX;
                    const top = bbox.top * scaleY + offsetY;
                    const width = (bbox.right - bbox.left) * scaleX;
                    const height = (bbox.bottom - bbox.top) * scaleY;
                    const isSelected = ayahKey === selectedAyahKey;

                    return (
                        <button
                            key={`${ayahKey}-${bboxIdx}`}
                            className={[
                                'absolute pointer-events-auto transition-all duration-150',
                                isSelected
                                    ? 'bg-green-700/20'
                                    : 'bg-transparent hover:bg-green-300/20',
                            ].join(' ')}
                            style={{ top, left, width, height }}
                            aria-label={`Ayah ${ayahKey}, Surah ${ayah.surah}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAyahSelect({
                                    pageKey,
                                    ayahKey,
                                    surah: ayah.surah,
                                    absoluteNumber: ayah.absolute_number,
                                });
                            }}
                        />
                    );
                })
            )}
        </div>
    );
}
