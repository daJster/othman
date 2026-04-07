import { Button } from '@/components/ui/button';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { useQuranReader } from '@/hooks/use-quran-reader';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import QuranReaderSidebar from './QuranReaderSidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

const QuranReaderNavbarContent = () => {
    const { nav } = useQuranReader();
    const { toggleSidebar } = useSidebar();

    return (
        <header className="w-full h-12 flex items-center justify-between px-4 py-2 border-b border-stone-100 bg-white dark:bg-green-900 backdrop-blur-sm text-green-900 dark:text-white z-10">
            <div className="flex items-center gap-4">
                <span className="text-xs tracking-widest uppercase">
                    Surah {nav?.currentSurah} · Ayah {nav?.currentAyah}
                </span>
            </div>
            <Button variant="ghost" onClick={toggleSidebar}>
                <Menu size={20} />
            </Button>
        </header>
    );
};

export const QuranReaderNavbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <TooltipProvider>
            <div className="h-12 w-full">
                <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <QuranReaderNavbarContent />
                    <QuranReaderSidebar title="Quran Reader" variant="floating" />
                </SidebarProvider>
            </div>
        </TooltipProvider>
    );
};
