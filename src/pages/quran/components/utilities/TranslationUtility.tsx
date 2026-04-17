'use client';

import { useEffect, useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { GlobeIcon } from 'lucide-react';
import { QURANPEDIA_BASE_URL } from '@/data/configData';
import { fetchData } from '@/lib/utils';
import type { Ayah } from '../AyahOverlay';

interface TranslationOption {
    id: number;
    name: string;
    author: string | null;
    year: number | null;
    category: { id: number; name: string };
}

interface TranslationUtilityProps {
    selectedAyah: Ayah;
}

export function TranslationUtility({ selectedAyah }: TranslationUtilityProps) {
    const [open, setOpen] = useState(false);
    const [availableTranslations, setAvailableTranslations] = useState<
        TranslationOption[]
    >([]);
    const [selectedTranslationId, setSelectedTranslationId] = useState<
        number | null
    >(null);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);

    useEffect(() => {
        if (open && selectedAyah) {
            fetchTranslations();
        }
    }, [open, selectedAyah]);

    const fetchTranslations = async () => {
        setOptionsLoading(true);
        try {
            const url = `${QURANPEDIA_BASE_URL}/v1/ayah/${selectedAyah.surah}/${selectedAyah.absoluteNumber}/translations`;
            const data = await fetchData<TranslationOption[]>(url);
            setAvailableTranslations(data);
            if (data.length > 0) {
                const defaultTranslation = data.find(
                    (t: TranslationOption) =>
                        t.name.includes('English') ||
                        t.name.includes('Sahih International')
                );
                setSelectedTranslationId(defaultTranslation?.id || data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch translations:', error);
            setAvailableTranslations([]);
        } finally {
            setOptionsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTranslationId && open) {
            fetchContent();
        }
    }, [selectedTranslationId, open]);

    const fetchContent = async () => {
        if (!selectedTranslationId) return;
        setLoading(true);
        try {
            const url = `${QURANPEDIA_BASE_URL}/v1/ayah/${selectedAyah.surah}/${selectedAyah.absoluteNumber}/translation?translation=${selectedTranslationId}`;
            const data = await fetchData<{ text?: string }[]>(url);
            if (Array.isArray(data) && data[0]?.text) {
                setContent(data[0].text);
            } else if (data && typeof data === 'object' && 'text' in data) {
                setContent((data as { text: string }).text);
            } else {
                setContent(JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.error('Failed to fetch translation:', error);
            setContent('Error loading translation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="h-[60vh] max-h-[60vh]">
                <DrawerHeader className="pb-2">
                    <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
                        <GlobeIcon className="size-5" />
                        الترجمة
                    </DrawerTitle>
                    <DrawerDescription className="text-sm text-muted-foreground">
                        سورة {selectedAyah.surah} - آية{' '}
                        {selectedAyah.absoluteNumber}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 pb-2">
                    {optionsLoading ? (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <Skeleton className="h-10 w-32 flex-shrink-0" />
                            <Skeleton className="h-10 w-32 flex-shrink-0" />
                            <Skeleton className="h-10 w-32 flex-shrink-0" />
                        </div>
                    ) : (
                        <ScrollArea className="w-full whitespace-nowrap py-1">
                            <div className="flex gap-2">
                                {availableTranslations.map((translation) => (
                                    <button
                                        key={translation.id}
                                        onClick={() =>
                                            setSelectedTranslationId(
                                                translation.id
                                            )
                                        }
                                        className={[
                                            'flex-shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors text-start',
                                            selectedTranslationId ===
                                            translation.id
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:bg-muted',
                                        ].join(' ')}
                                    >
                                        <div className="font-medium line-clamp-1">
                                            {translation.name}
                                        </div>
                                        {translation.author && (
                                            <div className="text-xs text-muted-foreground line-clamp-1">
                                                {translation.author}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="leading-7 whitespace-pre-wrap">
                                {content}
                            </p>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
