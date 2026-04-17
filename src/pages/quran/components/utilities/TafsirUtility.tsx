'use client';

import { useEffect, useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from '@/components/ui/drawer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { BookOpenIcon, LanguagesIcon, BookTextIcon } from 'lucide-react';
import { QURANPEDIA_BASE_URL } from '@/data/configData';
import { fetchData } from '@/lib/utils';
import type { Ayah } from '../AyahOverlay';

interface QuranPediaOption {
    id: number;
    name: string;
    author: string;
    year: number | null;
    category: { id: number; name: string };
}

interface TafsirUtilityProps {
    selectedAyah: Ayah;
}

const CONTENT_TYPES = [
    { value: 'tafsir', label: 'التفسير', icon: BookOpenIcon },
    { value: 'e3rab', label: 'الإعراب', icon: LanguagesIcon },
    { value: 'translation', label: 'الترجمة', icon: BookTextIcon },
] as const;

export function TafsirUtility({ selectedAyah }: TafsirUtilityProps) {
    const [open, setOpen] = useState(true);
    const [contentType, setContentType] = useState<
        'tafsir' | 'e3rab' | 'translation'
    >('tafsir');
    const [availableOptions, setAvailableOptions] = useState<
        QuranPediaOption[]
    >([]);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(
        null
    );
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);

    useEffect(() => {
        if (open && selectedAyah) {
            fetchAvailableOptions();
        }
    }, [open, selectedAyah, contentType]);

    const fetchAvailableOptions = async () => {
        setOptionsLoading(true);
        try {
            const url = `${QURANPEDIA_BASE_URL}/v1/ayah/${selectedAyah.surah}/${selectedAyah.absoluteNumber}/${contentType}`;
            const data = await fetchData<QuranPediaOption[]>(url);
            setAvailableOptions(data);
            if (data.length > 0) {
                setSelectedOptionId(data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch options:', error);
            setAvailableOptions([]);
        } finally {
            setOptionsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedOptionId && open) {
            fetchContent();
        }
    }, [selectedOptionId, open]);

    const fetchContent = async () => {
        if (!selectedOptionId) return;
        setLoading(true);
        try {
            const url = `${QURANPEDIA_BASE_URL}/v1/ayah/${selectedAyah.surah}/${selectedAyah.ayahKey}/${contentType}?${contentType}=${selectedOptionId}`;
            const data = await fetchData<{ text?: string }[]>(url);
            if (Array.isArray(data) && data[0]?.text) {
                setContent(data[0].text);
            } else if (data && typeof data === 'object' && 'text' in data) {
                setContent((data as { text: string }).text);
            } else {
                setContent(JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.error('Failed to fetch content:', error);
            setContent('Error loading content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="h-[60vh] max-h-[60vh]">
                <DrawerHeader className="pb-2">
                    <DrawerTitle className="text-lg font-semibold">
                        {contentType === 'tafsir'
                            ? 'التفسير'
                            : contentType === 'e3rab'
                              ? 'الإعراب'
                              : 'الترجمة'}
                    </DrawerTitle>
                    <DrawerDescription className="text-sm text-muted-foreground">
                        Surah {selectedAyah.surah} - Ayah {selectedAyah.ayahKey}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex w-full justify-center">
                    <ToggleGroup
                        type="single"
                        value={contentType}
                        onValueChange={(value: string) => {
                            if (value) {
                                setContentType(
                                    value as 'tafsir' | 'e3rab' | 'translation'
                                );
                                setSelectedOptionId(null);
                                setContent('');
                            }
                        }}
                        className="justify-center shadow-2xl"
                    >
                        {CONTENT_TYPES.map((type) => (
                            <ToggleGroupItem
                                key={type.value}
                                value={type.value}
                                aria-label={type.label}
                                className="border border-neutral-300/20"
                            >
                                <type.icon className="size-4" />
                                <span>{type.label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className="px-4 pb-2">
                    {optionsLoading ? (
                        <div className="flex justify-center h-100 w-full items-center">
                            <Spinner className="size-20" />
                        </div>
                    ) : (
                        <ScrollArea className="w-full whitespace-nowrap py-1">
                            <div className="flex gap-2">
                                {availableOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() =>
                                            setSelectedOptionId(option.id)
                                        }
                                        className={[
                                            'flex-shrink-0 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                                            selectedOptionId === option.id
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:bg-muted',
                                        ].join(' ')}
                                    >
                                        <div className="font-medium">
                                            {option.name}
                                        </div>
                                        {option.author && (
                                            <div className="text-xs text-muted-foreground">
                                                {option.author}
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
                        <div className="flex justify-center py-8">
                            <Spinner className="size-6" />
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
