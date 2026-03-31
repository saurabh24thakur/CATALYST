'use client';

import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-8 pt-24 pl-28">
            <UserProfile
                appearance={{
                    elements: {
                        card: 'bg-zinc-900 border border-zinc-800 shadow-xl',
                        headerTitle: 'text-slate-900',
                        headerSubtitle: 'text-slate-500',
                        profileSectionTitle: 'text-slate-900',
                        profileSectionContent: 'text-gray-300',
                        formFieldLabel: 'text-gray-300',
                        formFieldInput: 'bg-white border border-slate-200 shadow-sm border-zinc-700 text-slate-900',
                        navbarButton: 'text-gray-300 hover:text-slate-900',
                        navbarButtonIcon: 'text-slate-500',
                    }
                }}
            />
        </div>
    );
}
