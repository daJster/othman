import { useEffect } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { Button } from '@/components/ui/button.tsx';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/localStorage.ts';

const ThemeToggle = () => {
    const { t } = useTranslation();

    const getInitialTheme = (): 'light' | 'dark' => {
        const stored = getItem<'light' | 'dark' | ''>(STORAGE_KEYS.THEME, '');
        return stored || 'dark';
    };

    const applyTheme = (theme: 'light' | 'dark') => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        const root = document.documentElement;
        const isDark = root.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        applyTheme(newTheme);
        setItem(STORAGE_KEYS.THEME, newTheme);
    };

    useEffect(() => {
        applyTheme(getInitialTheme());
    }, []);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9 cursor-pointer"
                >
                    <MoonIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-black dark:text-white" />
                    <SunIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{t('nav.toggleTheme')}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default ThemeToggle;
