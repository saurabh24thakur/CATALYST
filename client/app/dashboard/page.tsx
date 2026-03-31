'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BookOpen, Trophy, Zap, Clock, Target } from 'lucide-react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-transparent flex items-center justify-center text-slate-900">Loading...</div>;
  }

  if (!isSignedIn || !user) {
    return null;
  }

  const displayName = user.fullName || user.firstName || user.username || 'User';
  const displayEmail = user.primaryEmailAddress?.emailAddress || '';
  const userInitial = displayName[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-8 pl-28 pt-24">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${orbitron.className}`}>
            Welcome back, <span className="text-blue-600">{displayName}</span>
          </h1>
          <p className="text-slate-500">Here's an overview of your progress and activity.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 uppercase tracking-wider">Current Level</p>
          <p className={`text-3xl font-bold text-blue-600 ${orbitron.className}`}>Novice</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Skills Analyzed"
          value="0"
          icon={<Activity className="w-5 h-5 text-blue-500" />}
          trend="+0% this week"
        />
        <StatsCard
          title="Roadmaps Created"
          value="0"
          icon={<MapIcon className="w-5 h-5 text-indigo-500" />}
          trend="Start your first one!"
        />
        <StatsCard
          title="Learning Streak"
          value="0 Days"
          icon={<Zap className="w-5 h-5 text-amber-500" />}
          trend="Keep it up!"
        />
        <StatsCard
          title="Total XP"
          value="0"
          icon={<Trophy className="w-5 h-5 text-emerald-500" />}
          trend="Next level: 100 XP"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity & Profile */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-500" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                {userInitial}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-slate-900">{displayName}</h3>
                <p className="text-slate-500">{displayEmail}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 shadow-sm rounded-full text-xs text-slate-600">Free Plan</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 shadow-sm rounded-full text-xs text-slate-600">Member since 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-500">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Account Created</p>
                    <p className="text-xs text-slate-500">Just now</p>
                  </div>
                </div>
                {/* Placeholder for more activity */}
                <div className="text-center py-4 text-slate-500 text-sm">
                  No other recent activity to show.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Actions or Next Steps */}
        <div className="space-y-8">
          <Card className="bg-white shadow-sm border-slate-200 h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => router.push('/upload')}
                className="w-full p-4 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all group text-left"
              >
                <h4 className="font-semibold text-blue-700 group-hover:text-blue-800 mb-1">Upload Resume</h4>
                <p className="text-sm text-blue-600/80">Analyze your skills and find gaps.</p>
              </button>

              <button
                onClick={() => router.push('/roadmap')}
                className="w-full p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all group text-left"
              >
                <h4 className="font-semibold text-slate-900 group-hover:text-slate-700 mb-1">View Roadmap</h4>
                <p className="text-sm text-slate-500">Track your learning journey.</p>
              </button>

              <button
                onClick={() => router.push(`/passport?userId=${user?.id || 'demo'}`)}
                className="w-full p-4 rounded-xl bg-indigo-50 border border-indigo-200 hover:border-indigo-300 hover:shadow-sm transition-all group text-left mt-4"
              >
                <h4 className="font-semibold text-indigo-700 group-hover:text-indigo-800 mb-1">View Skill Passport</h4>
                <p className="text-sm text-indigo-600/80">View and share your credentials.</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="bg-white shadow-sm border-slate-200 hover:border-slate-300 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          <p className="text-xs text-slate-500">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  )
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
