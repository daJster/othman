import type { ReactNode } from 'react';

import { Navbar } from '@/components/Navbar.tsx';
import { Footer } from '@/components/Footer.tsx';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex flex-col">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
