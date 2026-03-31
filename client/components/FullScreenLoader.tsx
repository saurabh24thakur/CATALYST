"use client";

import Image from "next/image";

export default function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-24 h-24">
                {/* Next.js Image with unoptimized for proper GIF rendering */}
                <Image
                    src="/loading.gif"
                    alt="Loading..."
                    fill
                    className="object-contain"
                    unoptimized
                />
            </div>
        </div>
    );
}
