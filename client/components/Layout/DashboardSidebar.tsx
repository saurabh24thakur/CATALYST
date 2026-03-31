'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import {
  Home,
  Upload,
  BarChart3,
  Map,
  LayoutDashboard,
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Analyze', href: '/analyze', icon: BarChart3 },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  if (pathname === '/') return null;

  const displayName = user?.fullName || user?.firstName || user?.username || 'S';
  const userInitial = displayName[0]?.toUpperCase() || 'S';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 bg-[#dceaf9]/80 backdrop-blur-md border-r border-[#c8dff5]/60 shadow-[4px_0_30px_rgba(0,0,0,0.03)] z-50 flex flex-col items-center py-6">
      <div className="mb-8 h-10"></div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative group
                ${active
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
              title={item.name}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                {item.name}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Clerk UserButton — handles sign out, profile, etc. */}
      <div className="mt-auto flex items-center justify-center">
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-10 h-10 border-2 border-slate-200 hover:border-slate-400 transition-all rounded-full',
            },
          }}
        />
      </div>
    </div>
  );
}
