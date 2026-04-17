import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Progress } from '@/components/ui/progress';
import {
    QuranReaderContext,
    type EditionBboxes,
    type EditionBboxesReversed,
    type QuranEdition,
    type QuranReaderContextValue,
    type SurahMetadata,
} from './contexts';
import { useTheme } from '@/hooks/use-theme';
import { CircleXIcon } from 'lucide-react';
import {
    AUDIO_QUALITIES,
    CDN_BASE_URL,
    createShaykhListConfig,
    isAyahNumberValid,
    QURAN_METADATA_URL,
} from '@/data/configData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAudio, fetchJSON } from '@/lib/utils';
import type { Ayah } from '@/pages/quran/components/AyahOverlay';

// ─── Navigation State ───────────────────────────────────────────────────────────

export interface QuranReaderNav {
    currentPage: number;
    currentSurah: number;
    currentAyah: Ayah | null;
    goToPage: (page: number) => void;
    goToSurah: (surah: number, ayah?: number) => void;
    goToAyah: (surah: number, ayah: number) => void;
    goToAbsoluteAyah: (absAyah: number | null) => void;
    goNextPage: () => void;
    goPrevPage: () => void;
    switchEdition: (editionKey: string) => void;
    pageImageUrl: (page: number) => string;
    formatPageNumber: (page: number) => string;
    ayahAudioFn: (
        absoluteAyah: number,
        quranShaykhId: string
    ) => Promise<HTMLAudioElement | null>;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const EDITIONS_URL = `${CDN_BASE_URL}/editions.json`;
const EDITION_STORAGE_KEY = 'quranreader:edition';
const PAGE_STORAGE_KEY = 'lastVisitedPage';
const CACHE_ASIDE_PAGES = 2; // how many pages to preload on each side

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatPageNumber(page: number): string {
    return String(page).padStart(3, '0');
}

function isPageValid(edition: QuranEdition, p: number) {
    return edition.first_page <= p && p <= edition.last_page;
}

/** Returns the image URL for a given page within an edition */
function pageImageUrl(edition: QuranEdition, page: number): string {
    return `${edition.base_url}/pages/${formatPageNumber(page)}.png`;
}

// ─── Image preload cache ────────────────────────────────────────────────────────

const preloadedImages = new Set<string>();

function clearImageCache() {
    preloadedImages.forEach((src) => {
        const img = document.querySelector<HTMLImageElement>(
            `img[src="${src}"]`
        );
        if (img) img.src = '';
    });
    preloadedImages.clear();
}

function preloadImage(url: string) {
    if (preloadedImages.has(url)) return;
    preloadedImages.add(url);
}

export const QuranReaderProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // ── data state ──────────────────────────────────────────────────────────
    const [editions, setEditions] = useState<{
        [key: string]: QuranEdition;
    } | null>(null);
    const [metadata, setMetadata] = useState<{
        [key: string]: SurahMetadata;
    } | null>(null);
    const [bboxesPerSurah, setBboxesPerSurah] = useState<EditionBboxes | null>(
        null
    );
    const [bboxesPerPage, setBboxesPerPage] =
        useState<EditionBboxesReversed | null>(null);
    const [selectedEditionKey, setSelectedEditionKey] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<Error | null>(null);

    // ── Navigation state ─────────────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSurah, setCurrentSurah] = useState(1);
    const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);

    const editionRef = useRef<QuranEdition | null>(null);

    // ── Boot sequence ────────────────────────────────────────────────────────────
    useEffect(() => {
        async function boot() {
            try {
                setLoading(true);
                setProgress(0);

                // Step 1 – fetch editions.json + quran.json
                const [editionsData, metadataData] = await Promise.all([
                    fetchJSON<{ [key: string]: QuranEdition }>(EDITIONS_URL),
                    fetchJSON<{ [key: string]: SurahMetadata }>(
                        QURAN_METADATA_URL
                    ),
                ]);
                setEditions(editionsData);
                setMetadata(metadataData);
                setProgress(20);

                // Step 2 – resolve edition (TODO switchable)
                const storedKey = localStorage.getItem(EDITION_STORAGE_KEY);
                const defaultKey = Object.keys(editionsData)[0];
                const resolvedKey =
                    storedKey && editionsData[storedKey]
                        ? storedKey
                        : defaultKey;
                const edition = editionsData[resolvedKey];
                setProgress(25);

                const { BBpage } = await switchEditionInner(
                    resolvedKey,
                    edition
                );

                const lastVisitedPage = Number(
                    localStorage.getItem(PAGE_STORAGE_KEY)
                );

                const resolvedCurrentPage =
                    Number.isFinite(lastVisitedPage) &&
                    isPageValid(edition, lastVisitedPage)
                        ? lastVisitedPage
                        : edition.first_page;
                setCurrentPage(resolvedCurrentPage);

                // Derive surah/ayah from bboxPage for start page
                syncSurahAyahFromPage(resolvedCurrentPage, BBpage!);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoading(false);
            }
        }

        boot();
    }, []);

    const syncSurahAyahFromPage = useCallback(
        (page: number, bboxPage: EditionBboxesReversed) => {
            const pageData = bboxPage[String(page)];
            if (!pageData) return;
            const firstAyahKey = Object.keys(pageData.ayat)[0];
            if (!firstAyahKey) return;
            const firstAyah = pageData.ayat[firstAyahKey];
            setCurrentSurah(firstAyah.surah);
            setCurrentAyah(null);
        },
        []
    );

    // ── Image preloading ─────────────────────────────────────────────────────────
    useEffect(() => {
        const edition = editionRef.current;
        if (!edition) return;
        Array.from(
            { length: CACHE_ASIDE_PAGES * 2 + 1 },
            (_, i) => currentPage - CACHE_ASIDE_PAGES + i
        )
            .filter((p) => isPageValid(edition, p))
            .map((p) => preloadImage(pageImageUrl(edition, p)));
    }, [currentPage]);

    // ── Navigation helpers ───────────────────────────────────────────────────────
    const selectedEdition = useMemo(
        () =>
            selectedEditionKey && editions
                ? editions[selectedEditionKey]
                : null,
        [selectedEditionKey, editions]
    );

    const goToPage = useCallback((page: number) => {
        const edition = editionRef.current;
        if (!edition) return;
        const safePage = Math.max(
            edition.first_page,
            Math.min(edition.last_page, page)
        );
        setCurrentPage(safePage);
    }, []);

    const goNextPage = useCallback(() => {
        setCurrentPage((p) => {
            const edition = editionRef.current;
            if (!edition) return p;
            const next = Math.min(p + 1, edition.last_page);
            return next;
        });
    }, []);

    const goPrevPage = useCallback(() => {
        setCurrentPage((p) => {
            const edition = editionRef.current;
            if (!edition) return p;
            const prev = Math.max(p - 1, edition.first_page);
            return prev;
        });
    }, []);

    /**
     * Navigate to the first page containing the first ayah of a surah.
     * Optionally supply an ayah number to land closer to that ayah.
     */
    const goToAyah = useCallback(
        (surah: number, ayah: number) => {
            if (!bboxesPerSurah) return;
            const surahData = bboxesPerSurah.surahs[`${surah}`];
            if (!surahData) return;
            const ayahData = surahData.ayat[`${ayah}`];
            if (!ayahData) return;
            goToPage(ayahData.page_num);
            setCurrentAyah({
                pageKey: ayahData.page_num,
                ayahKey: `${ayah}`,
                surah,
                absoluteNumber: ayahData.absolute_number,
            });
        },
        [bboxesPerSurah, goToPage]
    );

    const goToAbsoluteAyah = useCallback(
        (absoluteAyah: number | null) => {
            if (!absoluteAyah) {
                setCurrentAyah(null);
                return;
            }

            if (!isAyahNumberValid(absoluteAyah) || !bboxesPerSurah) return;

            for (const [s, surahData] of Object.entries(
                bboxesPerSurah.surahs
            )) {
                for (const [a, ayahData] of Object.entries(surahData.ayat)) {
                    if (ayahData.absolute_number === absoluteAyah) {
                        goToAyah(Number(s), Number(a));
                        return;
                    }
                }
            }
        },
        [bboxesPerSurah, goToAyah]
    );

    const goToSurah = useCallback(
        (surah: number, ayah = 1) => {
            setCurrentSurah(surah);
            goToAyah(surah, ayah);
        },
        [goToAyah]
    );

    const switchEditionInner = useCallback(
        async (editionKey: string, edition: QuranEdition) => {
            setSelectedEditionKey(editionKey);
            clearImageCache();
            editionRef.current = edition;
            setCurrentPage(edition.first_page);

            const bboxSurahPromise = fetchJSON<EditionBboxes>(
                edition.bbox_url
            ).then((d) => {
                setProgress(25 + Math.round(0.5 * 75));
                return d;
            });
            const bboxPagePromise = fetchJSON<EditionBboxesReversed>(
                edition.bbox_reversed_url
            ).then((d) => {
                setProgress(25 + Math.round(1 * 75));
                return d;
            });

            const [bboxesPerSurah, bboxesPerPage] = await Promise.all([
                bboxSurahPromise,
                bboxPagePromise,
            ]);

            setBboxesPerSurah(bboxesPerSurah);
            setBboxesPerPage(bboxesPerPage);

            return { BBpage: bboxesPerPage, BBsurah: bboxesPerSurah };
        },
        []
    );

    const switchEdition = useCallback(
        (editionKey: string) => {
            if (!editions) return;
            const resolvedEdition = editions[editionKey];
            if (!resolvedEdition) return;

            switchEditionInner(editionKey, resolvedEdition);
        },
        [editions, switchEditionInner]
    );

    const pageImageUrlFn = useCallback((page: number) => {
        const edition = editionRef.current;
        if (!edition) return '';
        return pageImageUrl(edition, page);
    }, []);

    const ayahAudioFn = useCallback(
        async (
            absoluteAyah: number,
            quranShaykhId: string
        ): Promise<HTMLAudioElement | null> => {
            const { readers } = createShaykhListConfig();
            const isValidShaykh = readers.some(
                (sh) => sh.identifier === quranShaykhId
            );

            if (!isValidShaykh || !isAyahNumberValid(absoluteAyah)) {
                return null;
            }

            const buildUrl = (
                n: number,
                quranShaykhId: string,
                quality: number
            ) =>
                `https://cdn.islamic.network/quran/audio/${quality}/${quranShaykhId}/${n}.mp3`;

            const getUrls = (n: number) =>
                AUDIO_QUALITIES.map((q) => buildUrl(n, quranShaykhId, q));

            const prefetchOffsets = [-1, 1, 2, 3];

            prefetchOffsets
                .map((offset) => absoluteAyah + offset)
                .filter(isAyahNumberValid)
                .forEach((n) => {
                    const [primary, ...fallbacks] = getUrls(n);
                    fetchAudio(primary, fallbacks);
                });

            const [primary, ...fallbacks] = getUrls(absoluteAyah);
            return fetchAudio(primary, fallbacks);
        },
        []
    );

    // ── Assemble context value ───────────────────────────────────────────────────
    const nav: QuranReaderNav = useMemo(
        () => ({
            currentPage,
            currentSurah,
            currentAyah,
            goToPage,
            goToSurah,
            goToAyah,
            goToAbsoluteAyah,
            goNextPage,
            goPrevPage,
            switchEdition,
            pageImageUrl: pageImageUrlFn,
            formatPageNumber,
            ayahAudioFn,
        }),
        [
            currentPage,
            currentSurah,
            currentAyah,
            goToPage,
            goToSurah,
            goToAyah,
            goToAbsoluteAyah,
            goNextPage,
            goPrevPage,
            switchEdition,
            pageImageUrlFn,
            ayahAudioFn,
        ]
    );

    const contextValue: QuranReaderContextValue = useMemo(
        () => ({
            editions,
            metadata,
            bboxesPerSurah,
            bboxesPerPage,
            selectedEditionKey,
            selectedEdition,
            loading,
            progress,
            error,
            nav: loading ? null : nav,
        }),
        [
            editions,
            metadata,
            bboxesPerSurah,
            bboxesPerPage,
            selectedEditionKey,
            selectedEdition,
            loading,
            progress,
            error,
            nav,
        ]
    );

    // ── Loading screen ───────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div
                className={`
                    flex flex-col items-center justify-center h-screen gap-8
                    ${isDark ? 'bg-green-950' : 'bg-white'}
                `}
            >
                <img
                    src={
                        isDark
                            ? '/quranReaderLandingLogo-light.png'
                            : '/quranReaderLandingLogo-dark.png'
                    }
                    alt="Quran"
                    className="w-45 opacity-90 transition-opacity ease-in-out animate-pulse animation-duration-700"
                />

                <div className="w-40">
                    <Progress value={progress} />
                </div>
            </div>
        );
    }

    // ── Error screen ─────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-2 text-red-600 dark:text-red-200">
                <CircleXIcon className="h-10 w-10 text-center" />
                <p>Failed to launch Quran Reader.</p>
                <Card className="rounded">
                    <CardContent>
                        {`Error Message : ${error.message}`}
                    </CardContent>
                </Card>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <QuranReaderContext.Provider value={contextValue}>
            {children}
        </QuranReaderContext.Provider>
    );
};
