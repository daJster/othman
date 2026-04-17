import {
    BookOpenIcon,
    LanguagesIcon,
    StickyNoteIcon,
    Volume2Icon,
} from 'lucide-react';
import type { Ayah } from './AyahOverlay';
import { QuranAyahReader } from './QuranAyahReader';

export interface UtilityConfig {
    label: string;
    icon: React.ReactNode;
    panelFn: (selectedAyah: Ayah) => React.ReactNode;
}

export interface QuranReaderUtilitiesConfig {
    utilities: { [key: string]: UtilityConfig };
    defaultUtility: string;
}

/**
 * createQuranReaderUtilitiesConfig
 *
 * Returns the full configuration object for the QuranReaderUtilities component.
 * Extend the `utilities` array here to add new tools in the future.
 */
export function createQuranReaderUtilitiesConfig(): QuranReaderUtilitiesConfig {
    return {
        defaultUtility: 'read',
        utilities: {
            read: {
                label: 'Read',
                icon: <Volume2Icon className="size-4" />,
                panelFn: (selectedAyah) => <QuranAyahReader selectedAyah={selectedAyah} />,
            },
            tafsir: {
                label: 'Tafsir',
                icon: <BookOpenIcon className="size-4" />,
                panelFn: () => <></>,
            },
            iirab: {
                label: 'Iʿrāb',
                icon: <LanguagesIcon className="size-4" />,
                panelFn: () => <></>,
            },
            note: {
                label: 'Note',
                icon: <StickyNoteIcon className="size-4" />,
                panelFn: () => <></>,
            },
        },
    };
}
