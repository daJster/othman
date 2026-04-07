import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuranReader } from '@/hooks/use-quran-reader';
import { useSwipe } from '@/hooks/use-swipe';
import {
    DURATION,
    QuranPage,
    type PageDirection,
} from './components/QuranPage';
import { QuranReaderNavbar } from './components/QuranReaderNavbar';
import { QuranReaderFooter } from './components/QuranReaderFooter';

export const QuranReaderPage = () => {
    const { nav } = useQuranReader();
    const [direction, setDirection] = useState<PageDirection>(null);
    const [tempPrevPage, setTempPrevPage] = useState<number | null>(null);
    const tempPageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Quran pages go RTL: next page = lower number in RTL contexts,
    // but we follow the nav helpers directly.
    const navigate = useCallback(
        (fn: () => void, dir: PageDirection) => {
            setTempPrevPage(nav!.currentPage);
            setDirection(dir);
            if (tempPageTimer.current) clearTimeout(tempPageTimer.current);
            tempPageTimer.current = setTimeout(
                () => setTempPrevPage(null),
                DURATION
            );
            fn();
        },
        [nav]
    );

    const handleNext = useCallback(
        () => navigate(nav!.goNextPage, 'right'),
        [nav, navigate]
    );

    const handlePrev = useCallback(
        () => navigate(nav!.goPrevPage, 'left'),
        [nav, navigate]
    );

    const swipe = useSwipe(handleNext, handlePrev);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handleNext();
            if (e.key === 'ArrowRight') handlePrev();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleNext, handlePrev]);

    if (!nav) return null;

    const page = nav.currentPage;

    // Desktop: odd = right page, even = left page
    // If odd, show page on right + page-1 on left
    // If even, show page on left + page+1 on right
    const rightPage = page % 2 !== 0 ? page : page + 1;
    const leftPage = rightPage + 1;

    return (
        <div
            className="flex flex-col items-center justify-between w-full min-h-screen bg-[#f5f0e8] overflow-hidden"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <QuranReaderNavbar />

            {/* ── Pages area ── */}

            {/* MOBILE: single full-screen page with swipe */}
            <div className="md:hidden flex-1 w-full overflow-hidden" {...swipe}>
                {tempPrevPage && (
                    <QuranPage
                        key={`prev-${tempPrevPage}`}
                        src={nav.pageImageUrl(tempPrevPage)}
                        alt={`Page ${tempPrevPage}`}
                        direction={direction}
                        animClass={
                            direction === 'left'
                                ? 'animate-slide-out-left'
                                : 'animate-slide-out-right'
                        }
                        side="full"
                    />
                )}

                <QuranPage
                    key={`current-${page}`}
                    src={nav.pageImageUrl(page)}
                    alt={`Page ${page}`}
                    direction={direction}
                    side="full"
                />
            </div>

            {/* DESKTOP: two-page spread, centered */}
            <div className="hidden md:flex flex-1 items-center justify-center w-full px-6 py-4 gap-1 max-w-5xl mx-auto">
                {/* Left page (even number) */}
                <div
                    className="flex-1 max-h-[calc(100vh-9rem)] overflow-hidden rounded-sm shadow-md border border-stone-200"
                    style={{ background: '#faf7f0' }}
                >
                    <QuranPage
                        src={nav.pageImageUrl(rightPage)}
                        alt={`Page ${rightPage}`}
                        direction={direction}
                        side="right"
                    />
                </div>

                {/* Spine shadow */}
                <div className="w-px self-stretch bg-linear-to-b from-transparent via-stone-300 to-transparent mx-1 rotate-180" />

                {/* Right page (odd number) */}
                <div
                    className="flex-1 max-h-[calc(100vh-9rem)] overflow-hidden rounded-sm shadow-md border border-stone-200"
                    style={{ background: '#faf7f0' }}
                >
                    <QuranPage
                        src={nav.pageImageUrl(leftPage)}
                        alt={`Page ${leftPage}`}
                        direction={direction}
                        side="left"
                    />
                </div>
            </div>

            {/* Bottom Navigation  */}
            <QuranReaderFooter
                handleNext={handleNext}
                handlePrev={handlePrev}
            />
        </div>
    );
};
