'use client';

import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8 pt-24 pl-28">
            <UserProfile
                appearance={{
                    elements: {
                        card: 'bg-zinc-900 border border-zinc-800 shadow-xl',
                        headerTitle: 'text-white',
                        headerSubtitle: 'text-gray-400',
                        profileSectionTitle: 'text-white',
                        profileSectionContent: 'text-gray-300',
                        formFieldLabel: 'text-gray-300',
                        formFieldInput: 'bg-zinc-800 border-zinc-700 text-white',
                        navbarButton: 'text-gray-300 hover:text-white',
                        navbarButtonIcon: 'text-gray-400',
                    }
                }}
            />
        </div>
    );
}
