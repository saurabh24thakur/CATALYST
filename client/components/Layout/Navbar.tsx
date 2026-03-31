'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Orbitron } from 'next/font/google';
import { useAuth, UserButton } from '@clerk/nextjs';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export default function Navbar() {
    const router = useRouter();
    const { isLoaded, userId } = useAuth();
    const pathname = usePathname();

    if (pathname === '/') return null;

    return (
        <header className="fixed top-0 right-0 left-20 z-40 bg-[#dceaf9]/80 backdrop-blur-md border-b border-[#c8dff5]/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold text-slate-900 tracking-widest ${orbitron.className}`}>
                        CATALYST
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {isLoaded && !userId && (
                        <button
                            className="text-slate-900 bg-zinc-700 px-4 py-2 rounded-full hover:bg-zinc-600 transition-colors"
                            onClick={() => router.push('/sign-in')}
                        >
                            Sign In
                        </button>
                    )}
                    {isLoaded && userId && (
                        <div className="flex items-center justify-center">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10 border-2 border-transparent hover:border-zinc-500 transition-colors"
                                    }
                                }}
                            />
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}
