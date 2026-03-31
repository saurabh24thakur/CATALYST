'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <main className={isHome ? '' : 'ml-20'}>
            {children}
        </main>
    );
}
