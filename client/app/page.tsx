'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Music, Users, MessageCircle, Briefcase, TrendingUp, TrendingDown } from 'lucide-react';
import { Quicksand, Inter, Orbitron } from 'next/font/google';

import gsap from 'gsap';
import Lenis from 'lenis';

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scrolling using Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    // Entrance Animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

      tl.from('header', { y: -20, opacity: 0, duration: 0.8, delay: 0.2 })
        .from('.hero-headline', { y: 30, opacity: 0, stagger: 0.2 }, "-=0.6")
        .from('.hero-text', { y: 20, opacity: 0 }, "-=0.8")
        .from('.hero-buttons', { y: 20, opacity: 0 }, "-=0.8")
        .from('.data-card', { y: 60, opacity: 0, stagger: 0.15, duration: 1.2, ease: 'expo.out' }, "-=0.6");

    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="landing-page min-h-screen bg-[#dceaf9] text-slate-800 p-3 md:p-6 overflow-x-hidden relative selection:bg-blue-200">

      {/* Background Decorators */}
      <div className="fixed inset-0 z-0 pointer-events-none light-grid-bg opacity-30" />

      {/* 
        This is the main white "card" frame that holds the landing page UI, 
        making it look exactly like the reference image.
      */}
      <div className="relative z-10 w-full min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-3rem)] bg-white/95 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_-15px_#0000000d] border border-white flex flex-col overflow-hidden">

        {/* Navigation (Matches the Aino mock exactly) */}
        <header className="landing-nav relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-10 h-10 relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm group-hover:shadow-md transition-all">
              <img src="/logo.png" alt="CATALYST Logo" className="w-full h-full object-contain" />
            </div>
            <span className={`text-xl font-bold tracking-widest text-slate-900 ${orbitron.className}`}>CATALYST</span>
          </div>

          <nav className={`hidden md:flex items-center p-1 bg-slate-100/60 backdrop-blur-md rounded-full shadow-inner ${inter.className} text-sm font-medium text-slate-500`}>
            <a href="#" className="px-5 py-2 text-slate-900 font-bold bg-white rounded-full shadow-[0_2px_10px_#00000015] transition-all">Home</a>
            <a href="#" className="px-5 py-2 hover:text-slate-900 transition-colors">About</a>
            <a href="#" className="px-5 py-2 hover:text-slate-900 transition-colors">Contact</a>

          </nav>

          <button
            onClick={() => router.push('/upload')}
            className={`flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors ${inter.className}`}
          >
            <span>Get started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">

          {/* Headlines */}
          <h1 className={`hero-headline text-5xl md:text-[10rem] font-bold leading-[1.1] tracking-tight mb-2 ${quicksand.className}`}>
            Stop Watching
          </h1>
          <h1 className={`hero-headline text-5xl md:text-[10rem] font-bold leading-[1.1] tracking-tight mb-8 flex items-center justify-center gap-4 ${quicksand.className}`}>
            Start Doing
          </h1>

          <p className={`hero-text text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed ${inter.className}`}>
            Video is for Entertainment. CATALYST is for Mastery.
          </p>

          {/* Buttons */}
          <div className="hero-buttons flex items-center gap-4 mb-20">
            <button
              onClick={() => router.push('/upload')}
              className={`flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-base font-semibold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all ${inter.className}`}
            >
              <span>Let&apos;s begin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md text-slate-900 border border-white rounded-full text-base font-semibold hover:bg-white hover:shadow-lg transition-all ${inter.className}`}
            >
              <span>Explore features</span>
              <Music className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* The 3 Data Dashboard Cards */}
          <div className="w-full flex justify-center items-end gap-6 flex-wrap md:flex-nowrap pb-20">

            {/* Card 1: Total applicants (Purple) */}
            <div className={`data-card flex-1 min-w-[280px] bg-[#E5E4F9] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#8b5cf620] transform hover:-translate-y-2 transition-transform duration-500`}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col text-left">
                  <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Total applicants</p>
                  <div className="flex items-end gap-3">
                    <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>+120</h3>
                    <div className="flex flex-col items-start pb-2">
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-emerald-500 rounded text-[10px] font-bold ${inter.className}`}>
                        <TrendingUp className="w-3 h-3" /> +24%
                      </span>
                      <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>vs last week</span>
                    </div>
                  </div>
                </div>
                <Users className="w-5 h-5 text-slate-500" />
              </div>

              {/* Stacked Chart (Col 1) */}
              <div className="mt-auto h-[120px] w-full flex items-end justify-between gap-1.5 px-0.5">
                {[
                  { s: 'h-[20px]', h: 'h-[32px]', d: 'h-[20px]' },
                  { s: 'h-[16px]', h: 'h-[24px]', d: 'h-[12px]' },
                  { s: 'h-[20px]', h: 'h-[20px]', d: 'h-[12px]' },
                  { s: 'h-[28px]', h: 'h-[28px]', d: 'h-[20px]' },
                  { s: 'h-[36px]', h: 'h-[32px]', d: 'h-[28px]' },
                  { s: 'h-[24px]', h: 'h-[40px]', d: null },
                ].map((col, i) => (
                  <div key={i} className="flex flex-col gap-1 w-full justify-end h-full">
                    {col.d && <div className={`w-full rounded-[6px] ${col.d}`} style={{ backgroundImage: 'radial-gradient(circle, #47556960 1.5px, transparent 1.5px)', backgroundSize: '6px 6px' }}></div>}
                    {col.h && <div className={`w-full rounded-[6px] ${col.h}`} style={{ backgroundImage: 'repeating-linear-gradient(45deg, #47556940 0, #47556940 1.5px, transparent 1.5px, transparent 6px)' }}></div>}
                    <div className={`w-full rounded-[6px] bg-gradient-to-b from-slate-600 to-[#1e1e28] shadow-sm ${col.s}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Interviewed (Blue) */}
            <div className={`data-card flex-1 min-w-[280px] bg-[#Dceaf9] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#3b82f620] z-20 transform hover:-translate-y-2 transition-transform duration-500`}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col text-left">
                  <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Interviewed</p>
                  <div className="flex items-end gap-3">
                    <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>+24</h3>
                    <div className="flex flex-col items-start pb-2">
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-rose-500 rounded text-[10px] font-bold ${inter.className}`}>
                        <TrendingDown className="w-3 h-3" /> -14%
                      </span>
                      <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>vs last week</span>
                    </div>
                  </div>
                </div>
                <MessageCircle className="w-5 h-5 text-slate-500" />
              </div>

              {/* Simple Solid Chart (Col 2) */}
              <div className="mt-auto h-[120px] w-full flex items-end justify-between gap-1.5 px-0.5">
                {['h-[24px]', 'h-[64px]', 'h-[32px]', 'h-[48px]', 'h-[88px]', 'h-[64px]'].map((h, i) => (
                  <div key={i} className="flex flex-col gap-1 w-full justify-end h-full">
                    <div className={`w-full rounded-[6px] bg-gradient-to-b from-slate-600 to-[#1e1e28] shadow-sm ${h}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Job offers (Pink) */}
            <div className={`data-card flex-1 min-w-[280px] bg-[#F3D8EE] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#ec489920] transform hover:-translate-y-2 transition-transform duration-500`}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col text-left">
                  <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Job offers</p>
                  <div className="flex items-end gap-3">
                    <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>+6</h3>
                    <div className="flex flex-col items-start pb-2">
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-emerald-500 rounded text-[10px] font-bold ${inter.className}`}>
                        <TrendingUp className="w-3 h-3" /> +30%
                      </span>
                      <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>vs last week</span>
                    </div>
                  </div>
                </div>
                <Briefcase className="w-5 h-5 text-slate-500" />
              </div>

              {/* Stacked Chart (Col 3) */}
              <div className="mt-auto h-[120px] w-full flex items-end justify-between gap-1.5 px-0.5">
                {[
                  { s: 'h-[20px]', h: 'h-[40px]' },
                  { s: 'h-[16px]', h: 'h-[28px]' },
                  { s: 'h-[20px]', h: 'h-[20px]' },
                  { s: 'h-[28px]', h: 'h-[36px]' },
                  { s: 'h-[36px]', h: 'h-[56px]' },
                  { s: 'h-[44px]', h: 'h-[72px]' },
                ].map((col, i) => (
                  <div key={i} className="flex flex-col gap-1 w-full justify-end h-full">
                    {col.h && <div className={`w-full rounded-[6px] ${col.h}`} style={{ backgroundImage: 'repeating-linear-gradient(45deg, #47556940 0, #47556940 1.5px, transparent 1.5px, transparent 6px)' }}></div>}
                    <div className={`w-full rounded-[6px] bg-gradient-to-b from-slate-600 to-[#1e1e28] shadow-sm ${col.s}`}></div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* HOW IT WORKS SECTION */}
          <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 mt-12 bg-white/50 rounded-[2rem] border border-white/60">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-5xl font-bold text-slate-900 mb-6 ${quicksand.className}`}>
                How It Works
              </h2>
              <p className={`text-lg text-slate-500 max-w-2xl mx-auto ${inter.className}`}>
                Get from resume to roadmap in 3 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {/* Step 1 */}
              <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100/50 hover:bg-white transition-colors">
                <div className="text-4xl mb-6">📄</div>
                <div className={`text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 ${inter.className}`}>STEP 01</div>
                <h3 className={`text-xl font-bold text-slate-900 mb-4 ${quicksand.className}`}>Upload Resume</h3>
                <p className={`text-slate-500 ${inter.className}`}>Upload your resume and let AI extract your skills in seconds.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100/50 hover:bg-white transition-colors delay-75">
                <div className="text-4xl mb-6">📊</div>
                <div className={`text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 ${inter.className}`}>STEP 02</div>
                <h3 className={`text-xl font-bold text-slate-900 mb-4 ${quicksand.className}`}>Analyze Gap</h3>
                <p className={`text-slate-500 ${inter.className}`}>Compare your skills with job requirements and get a readiness score.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100/50 hover:bg-white transition-colors delay-150">
                <div className="text-4xl mb-6">🗺️</div>
                <div className={`text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 ${inter.className}`}>STEP 03</div>
                <h3 className={`text-xl font-bold text-slate-900 mb-4 ${quicksand.className}`}>Follow Roadmap</h3>
                <p className={`text-slate-500 ${inter.className}`}>Get a personalized 6-week learning plan with curated resources.</p>
              </div>
            </div>
          </section>

          {/* STATS SECTION */}
          <section className="w-full max-w-7xl mx-auto px-6 py-16 mb-12">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center ${inter.className}`}>
              <div>
                <div className={`text-4xl md:text-5xl font-bold text-slate-900 mb-2 ${quicksand.className}`}>50+</div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Skills Analyzed</div>
              </div>
              <div>
                <div className={`text-4xl md:text-5xl font-bold text-slate-900 mb-2 ${quicksand.className}`}>95%</div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Accuracy Rate</div>
              </div>
              <div>
                <div className={`text-4xl md:text-5xl font-bold text-slate-900 mb-2 ${quicksand.className}`}>6</div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Week Programs</div>
              </div>
              <div>
                <div className={`text-4xl md:text-5xl font-bold text-slate-900 mb-2 ${quicksand.className}`}>1000+</div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Jobs Matched</div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className={`w-full text-center py-8 border-t border-slate-100 text-sm text-slate-400 ${inter.className}`}>
            © 2024 Skill-Bridge. All rights reserved. @saurabh24thakur
          </footer>

        </main>

      </div> {/* End of white frame wrapper */}
    </div>
  );
}
