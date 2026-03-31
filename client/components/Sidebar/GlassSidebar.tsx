'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

interface GlassSidebarProps {
  user: User;
  readinessScore: number;
}

export default function GlassSidebar({ user, readinessScore }: GlassSidebarProps) {
  const navigationItems = [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '📄', label: 'Resume', href: '/upload' },
    { icon: '🎯', label: 'Gap Analysis', href: '/analyze' },
    { icon: '🗺️', label: 'Roadmap', href: '/roadmap' },
    { icon: '🎮', label: 'Simulations', href: '/dashboard' },
  ];

  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="
        fixed left-0 top-0 h-screen w-80 z-50
        
        /* Glassmorphism */
        bg-white/80
        backdrop-blur-2xl backdrop-saturate-150
        
        /* Border */
        border-r border-slate-200
        shadow-xl shadow-slate-200/50
        
        overflow-y-auto
      "
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-blue-500/30 ring-offset-2 ring-offset-white shadow-sm">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-xl">
              {user.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {user.name}
            </h3>
            <p className="text-sm text-slate-500">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Readiness Score Card */}
      <div className="p-6">
        <div className="
          relative overflow-hidden rounded-2xl
          bg-slate-50
          border border-slate-200
          shadow-sm
          p-6
        ">
          {/* Animated background glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute -top-10 -right-10 w-40 h-40
              bg-blue-200/50 rounded-full blur-3xl
            "
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600">
                Hiring Readiness
              </span>
              <Badge className="
                bg-blue-100 text-blue-700 border-0
              ">
                {readinessScore >= 80 ? 'Ready' : 'In Progress'}
              </Badge>
            </div>

            {/* Large score display */}
            <div className="mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-6xl font-bold text-slate-900"
              >
                {readinessScore}%
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${readinessScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {100 - readinessScore}% to target role
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ x: 4 }}
              className="
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-slate-600 hover:text-blue-600
                hover:bg-blue-50
                transition-colors
                group
                cursor-pointer
              "
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </motion.div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-slate-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-900">12</div>
            <div className="text-xs text-slate-500">Skills</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">8</div>
            <div className="text-xs text-slate-500">Gaps</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">5</div>
            <div className="text-xs text-slate-500">Level</div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
