'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { AnimatePresence, motion } from 'framer-motion';
import {
    createQuranReaderUtilitiesConfig,
} from './utilities/utilitiesConfig';
import type { Ayah } from './AyahOverlay';

export interface QuranReaderUtilitiesProps {
    selectedAyah: Ayah | null;
    className?: string;
}

const panelVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

export function QuranReaderUtilities({
    selectedAyah,
}: QuranReaderUtilitiesProps) {
    const config = createQuranReaderUtilitiesConfig();
    const [activeKey, setActiveKey] = useState<string>(config.defaultUtility);

    const handleUtilityChange = (key: string) => {
        setActiveKey(key);
    };

    const activeConfigKey =
        Object.keys(config.utilities).find((u) => u === activeKey) ??
        config.defaultUtility;
    const activeConfig = config.utilities[activeConfigKey];

    return (
        <AnimatePresence mode="wait">
            {selectedAyah ? (
                <>
                    <motion.div
                        key="utilities-container"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-20 left-0 flex w-full justify-center"
                    >
                        <ButtonGroup>
                            {Object.entries(config.utilities).map(
                                ([key, utility]) => (
                                    <Button
                                        key={key}
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleUtilityChange(key)}
                                        className={[
                                            'gap-1.5 transition-colors duration-150 font-sans dark:text-white dark:bg-muted h-13 text-md px-4',
                                            activeKey === key &&
                                                ' dark:bg-muted/85 dark:text-white bg-white text-neutral-700 border border-neutral-500/50 shadow-sm',
                                        ].join(' ')}
                                        aria-pressed={activeKey === key}
                                    >
                                        {utility.icon}
                                        {utility.label}
                                    </Button>
                                )
                            )}
                        </ButtonGroup>
                    </motion.div>

                    <div className="absolute bottom-2 left-0 w-full flex justify-center px-2">
                        <motion.div
                            key={activeKey}
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{
                                duration: 0.1,
                                ease: 'easeOut',
                            }}
                            className="w-full max-w-2xl"
                        >
                            {activeConfig?.panelFn(selectedAyah)}
                        </motion.div>
                    </div>
                </>
            ) : null}
        </AnimatePresence>
    );
}
