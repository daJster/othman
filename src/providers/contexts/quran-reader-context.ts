import { createContext } from 'react';
import type { QuranReaderNav } from '../QuranReaderProvider';

export type SurahLocation = 'madina' | 'makka' 

export type Bbox = {"top" : number, "left": number, "bottom": number, "right": number}

export type SurahMetadata =  {
    name: string;
    name_en: string;
    location: SurahLocation
    number_of_ayat: number
}

export type QuranEdition =  {
    name: string;
    riwaya: string;
    base_url: string;
    bbox_url: string;
    bbox_reversed_url: string;
    first_page: number;
    last_page: number;
}

export type EditionBboxes =  {"surahs" : {
    [surahKey: string] : {
        "ayat" : {
            [AyahKey: string] : {
                absolute_number: number;
                page_num: number;
                bboxes: Bbox[];
            }
        }
    }
}}

export type EditionBboxesReversed = {"pages" : {
    [pageKey: string] : {
        "ayat" : {
            [AyahKey: string] : {
                absolute_number: number;
                bboxes: Bbox[];
                surah: number;
            }
        }
    }
}}

export interface QuranReaderContextValue {
    editions: {[key: string] : QuranEdition} | null;
    metadata: {[key: string] : SurahMetadata} | null;
    bboxesPerSurah: EditionBboxes | null;
    bboxesPerPage: EditionBboxesReversed | null;
    loading: boolean;
    error: Error | null;
    nav: QuranReaderNav | null;
}

export const QuranReaderContext = createContext<QuranReaderContextValue | null>(null);