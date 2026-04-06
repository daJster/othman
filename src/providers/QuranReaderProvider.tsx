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
import { CDN_BASE_URL, QURAN_METADATA_URL } from '@/data/configData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ─── Navigation State ───────────────────────────────────────────────────────────

export interface QuranReaderNav {
    currentPage: number;
    currentSurah: number;
    currentAyah: number;
    goToPage: (page: number) => void;
    goToSurah: (surah: number, ayah?: number) => void;
    goToAyah: (surah: number, ayah: number) => void;
    goNextPage: () => void;
    goPrevPage: () => void;
    pageImageUrl: (page: number) => string;
    formatPageNumber: (page: number) => string;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const EDITIONS_URL = `${CDN_BASE_URL}/editions.json`;
const EDITION_STORAGE_KEY = 'quranreader:edition';
const PAGE_STORAGE_KEY = 'lastVisitedPage';
const CACHE_ASIDE_PAGES = 2; // how many pages to preload on each side

// ─── Helpers ────────────────────────────────────────────────────────────────────

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

// ─── Simple in-memory + fetch cache ────────────────────────────────────────────

const jsonCache = new Map<string, unknown>();

async function fetchJSON<T>(url: string): Promise<T> {
  if (jsonCache.has(url)) return jsonCache.get(url) as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data: T = await res.json();
  jsonCache.set(url, data);
  return data;
}

// ─── Image preload cache ────────────────────────────────────────────────────────

const preloadedImages = new Set<string>();

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
    const [currentAyah, setCurrentAyah] = useState(1);

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

                // Step 2 – resolve edition
                const storedKey = localStorage.getItem(EDITION_STORAGE_KEY);
                const defaultKey = Object.keys(editionsData)[0];
                const resolvedKey =
                    storedKey && editionsData[storedKey]
                        ? storedKey
                        : defaultKey;
                setSelectedEditionKey(resolvedKey);
                const edition = editionsData[resolvedKey];
                editionRef.current = edition;
                setProgress(25);

                // Fetch both bbox files; report progress at midpoint
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

                const [bboxPerSurah, bboxPerPage] = await Promise.all([
                    bboxSurahPromise,
                    bboxPagePromise,
                ]);

                setBboxesPerSurah(bboxPerSurah);
                setBboxesPerPage(bboxPerPage);
                setProgress(100);

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
                syncSurahAyahFromPage(resolvedCurrentPage, bboxPerPage);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoading(false);
            }
        }

        boot();
    }, []);

    // ── Derive surah/ayah from page bboxes ───────────────────────────────────────
    const syncSurahAyahFromPage = useCallback(
        (page: number, bboxPage: EditionBboxesReversed) => {
            const pageData = bboxPage.pages[String(page)];
            if (!pageData) return;
            const firstAyahKey = Object.keys(pageData.ayat)[0]; // get first ayah of the page
            if (!firstAyahKey) return;
            const firstAyah = pageData.ayat[firstAyahKey];
            setCurrentSurah(firstAyah.surah);
            // ayah key is "surah:ayah"
            const ayahNum = parseInt(firstAyahKey.split(':')[1] ?? '1', 10);
            setCurrentAyah(Number.isFinite(ayahNum) ? ayahNum : 1);
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

    // Persist page to session storage & Sync to Surah/Ayah
    useEffect(() => {
        sessionStorage.setItem(PAGE_STORAGE_KEY, String(currentPage));
        if (bboxesPerPage) syncSurahAyahFromPage(currentPage, bboxesPerPage);
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
    const goToSurah = useCallback(
        (surah: number, ayah = 1) => {
            if (!bboxesPerSurah) return;
            const surahData = bboxesPerSurah.surahs[String(surah)];
            if (!surahData) return;
            const ayahData =
                surahData.ayat[`${surah}:${ayah}`] ??
                surahData.ayat[Object.keys(surahData.ayat)[0]];
            if (!ayahData) return;
            setCurrentSurah(surah);
            setCurrentAyah(ayah);
            goToPage(ayahData.page_num);
        },
        [bboxesPerSurah, goToPage]
    );

    const goToAyah = useCallback(
        (surah: number, ayah: number) => {
            goToSurah(surah, ayah);
            setCurrentAyah(ayah);
        },
        [goToSurah]
    );

    const pageImageUrlFn = useCallback((page: number) => {
        const edition = editionRef.current;
        if (!edition) return '';
        return pageImageUrl(edition, page);
    }, []);

    // ── Assemble context value ───────────────────────────────────────────────────
    const nav: QuranReaderNav = useMemo(
        () => ({
            currentPage,
            currentSurah,
            currentAyah,
            goToPage,
            goToSurah,
            goToAyah,
            goNextPage,
            goPrevPage,
            pageImageUrl: pageImageUrlFn,
            formatPageNumber,
        }),
        [
            currentPage,
            currentSurah,
            currentAyah,
            goToPage,
            goToSurah,
            goToAyah,
            goNextPage,
            goPrevPage,
            pageImageUrlFn
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
                    className="w-45 opacity-90 transition-opacity duration-700 ease-in-out animate-fadeIn"
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
                <Card className='rounded'>
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
