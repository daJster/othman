export type PageDirection = 'left' | 'right' | null;

export const DURATION = 360;

export interface QuranPageProps {
    src: string;
    alt: string;
    direction: PageDirection;
    animClass?: string | null;
    side?: 'left' | 'right' | 'full';
}

const slideIn: Record<
    NonNullable<PageDirection>,
    Record<'left' | 'right' | 'full', string>
> = {
    left: {
        full: 'animate-slide-in-left',
        left: 'animate-slide-in-left',
        right: 'animate-slide-in-left',
    },
    right: {
        full: 'animate-slide-in-right',
        left: 'animate-slide-in-right',
        right: 'animate-slide-in-right',
    },
};


export function QuranPage({
    src,
    alt,
    direction,
    side = 'full',
    animClass = null,
}: QuranPageProps) {
    const resolvedAnimClass =
        animClass ?? (direction ? slideIn[direction][side] : '');

    return (
        <div
            className={`absolute top-0 left-0 py-30 flex items-center justify-center h-screen w-screen max-w-4xl overflow-hidden ${resolvedAnimClass} bg-[#FFFFD7]`}
            style={{
                animationDuration: `${DURATION}ms`,
                animationFillMode: 'both',
            }}
        >
            <img
                src={src}
                alt={alt}
                className="h-full w-full max-w-xl"
                draggable={false}
            />
        </div>
    );
}