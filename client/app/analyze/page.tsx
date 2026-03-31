'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Users, MessageCircle, Briefcase, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { Quicksand, Inter } from 'next/font/google';

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

import MetricCard from '@/components/ui/metric-card';
import TimelineBar from '@/components/ui/timeline-bar';
import ReadinessAreaChart from '@/components/ui/readiness-area-chart';
import SkillsDistributionChart from '@/components/ui/skills-distribution-chart';

interface SkillGap {
  skill: string;
  category: string;
  importance: number;
  currentLevel: number;
  targetLevel: number;
  estimatedHours: number;
  reason: string;
}

interface MatchedSkill {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  status: string;
}

interface Analysis {
  requiredSkills: any[];
  skillGaps: SkillGap[];
  matchedSkills: MatchedSkill[];
  hiringReadinessScore: number;
  summary: string;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<any>(null);

  useEffect(() => {
    const skills = localStorage.getItem('extracted_skills');
    if (skills) {
      setExtractedSkills(JSON.parse(skills));
    } else {
      router.push('/upload');
    }
  }, [router]);

  const handleAnalyze = async () => {
    if (!targetRole || !jobDescription) {
      alert('Please fill in all fields');
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSkills: extractedSkills,
          targetRole,
          jobDescription
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysis(data.analysis);
        localStorage.setItem('gap_analysis', JSON.stringify(data.analysis));
        localStorage.setItem('target_role', targetRole);
      } else {
        alert(data.error || 'Failed to analyze');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze');
    } finally {
      setAnalyzing(false);
    }
  };

  const getGapColor = (gap: number): 'green' | 'orange' | 'white' | 'slate' => {
    if (gap === 0) return 'green';
    if (gap <= 2) return 'slate';
    return 'white';
  };

  // Prepare data for charts
  const readinessData = analysis ? [
    { name: 'Week 1', score: 45 },
    { name: 'Week 2', score: 52 },
    { name: 'Week 3', score: 49 },
    { name: 'Week 4', score: 60 },
    { name: 'Week 5', score: 58 },
    { name: 'Week 6', score: 65 },
    { name: 'Current', score: analysis.hiringReadinessScore }
  ] : [];

  const gapDistributionData = analysis ? [
    { name: 'Gaps', value: analysis.skillGaps.length },
    { name: 'Matched', value: analysis.matchedSkills.length },
  ] : [];

  return (
    <div className="">

      <div className="p-8 flex flex-col items-center w-full">
        {/* Header */}
        <div className="mb-12 mt-16 text-center flex flex-col items-center justify-center w-full">
          <div className="text-sm font-bold tracking-widest !text-blue-600 mb-2 uppercase">STEP 2 OF 3</div>
          <h1 className="text-4xl md:text-5xl font-bold !text-slate-900 mb-4 px-4">Skill Gap Analysis</h1>
          <p className="text-lg !text-slate-600 px-4">Compare your skills with your target role</p>
        </div>

        {!analysis ? (
          <div className="max-w-2xl space-y-6">
            {/* Input Form */}
            <Card className="dashboard-card w-100 p-6 bg-white border border-slate-200 shadow-sm space-y-4 border-none">
              <div>
                <label className="text-sm mb-2 !text-slate-800 font-bold block">Target Role</label>
                <Input
                  placeholder="e.g., Full Stack Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="bg-transparent border-slate-300 !text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-sm mb-2 !text-slate-800 font-bold block">Job Description</label>
                <Textarea
                  placeholder="Paste the complete job description here..."
                  rows={12}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="bg-transparent border-slate-300 !text-slate-900 font-mono text-sm"
                />
              </div>

              <Button
                className="flex items-center justify-center gap-2 px-6 py-3 !bg-[#0f172a] !text-white rounded-full text-sm font-bold hover:!bg-[#1e293b] hover:shadow-xl transition-all border-none w-full"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Skill Gap'
                )}
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {/* Rich Metrics Dashboard */}

            <div className="flex flex-col md:flex-row justify-center items-end gap-6 w-full mb-8 max-w-7xl mx-auto px-4">
              {/* Card 1: Readiness Trend (Purple) */}
              <div className={`data-card flex-1 min-w-[280px] bg-[#E5E4F9] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#8b5cf620] transform hover:-translate-y-2 transition-transform duration-500`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left">
                    <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Readiness Trend</p>
                    <div className="flex items-end gap-3">
                      <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>{analysis.hiringReadinessScore}%</h3>
                      <div className="flex flex-col items-start pb-2">
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-emerald-500 rounded text-[10px] font-bold ${inter.className}`}>
                          <TrendingUp className="w-3 h-3" /> +2.4%
                        </span>
                        <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>Hiring Score</span>
                      </div>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-slate-500" />
                </div>

                {/* Custom Sparkline Chart */}
                <div className="mt-auto h-[120px] w-full flex items-end justify-between gap-1 px-0.5 relative">
                  {/* Fake area graph with CSS */}
                  <div className="absolute inset-x-0 bottom-[30px] h-[60px] opacity-20 bg-gradient-to-t from-slate-500 to-transparent clip-path-sparkline"></div>
                  {readinessData.map((d, i) => {
                    const h = (d.score / 100) * 90;
                    return (
                      <div key={i} className="flex flex-col gap-1 w-full justify-end h-full items-center group relative">
                        <span className="absolute -top-6 text-[10px] bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{d.name}: {d.score}%</span>
                        <div className={`w-2 h-2 rounded-full bg-slate-600 mb-1`}></div>
                        <div className={`w-[3px] rounded-full bg-slate-900/40`} style={{ height: `${Math.max(4, h)}px` }}></div>
                        <span className={`text-[9px] uppercase font-bold text-slate-500 mt-1 truncate w-full text-center ${inter.className}`}>{d.name.split(' ')[1] || d.name[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Gap vs Match (Blue) */}
              <div className={`data-card flex-1 min-w-[280px] bg-[#Dceaf9] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#3b82f620] z-20 transform hover:-translate-y-2 transition-transform duration-500`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left">
                    <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Gap vs Match</p>
                    <div className="flex items-end gap-3">
                      <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>{analysis.matchedSkills.length}/{analysis.skillGaps.length + analysis.matchedSkills.length}</h3>
                      <div className="flex flex-col items-start pb-2">
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-rose-500 rounded text-[10px] font-bold ${inter.className}`}>
                          <TrendingDown className="w-3 h-3" /> {analysis.skillGaps.length} Gaps
                        </span>
                        <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>Skills Covered</span>
                      </div>
                    </div>
                  </div>
                  <MessageCircle className="w-5 h-5 text-slate-500" />
                </div>

                {/* Stacked Chart for Gaps/Match */}
                <div className="mt-auto h-[120px] w-full flex items-end justify-center gap-6 px-10">
                  <div className="flex flex-col items-center gap-3 flex-1 h-full justify-end group relative">
                    <span className="absolute -top-6 text-[10px] bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">Matched: {analysis.matchedSkills.length}</span>
                    <div className="w-full rounded-xl" style={{ height: '20px', backgroundImage: 'radial-gradient(circle, #47556960 1.5px, transparent 1.5px)', backgroundSize: '6px 6px' }}></div>
                    <div className="w-full bg-gradient-to-b from-slate-600 to-[#1e1e28] rounded-xl shadow-md" style={{ height: `${(analysis.matchedSkills.length / (analysis.skillGaps.length + analysis.matchedSkills.length)) * 80}px`, minHeight: '30px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Match</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 flex-1 h-full justify-end group relative">
                    <span className="absolute -top-6 text-[10px] bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">Gaps: {analysis.skillGaps.length}</span>
                    <div className="w-full rounded-xl" style={{ height: '30px', backgroundImage: 'repeating-linear-gradient(45deg, #ef444440 0, #ef444440 1.5px, transparent 1.5px, transparent 6px)' }}></div>
                    <div className="w-full bg-gradient-to-b from-rose-500 to-rose-900 rounded-xl shadow-md" style={{ height: `${(analysis.skillGaps.length / (analysis.skillGaps.length + analysis.matchedSkills.length)) * 80}px`, minHeight: '20px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Gaps</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Matched Skills Breakdown (Pink) */}
              <div className={`data-card flex-1 min-w-[280px] bg-[#F3D8EE] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#ec489920] transform hover:-translate-y-2 transition-transform duration-500`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left">
                    <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Matched Skills</p>
                    <div className="flex items-end gap-3">
                      <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>{analysis.matchedSkills.length}</h3>
                      <div className="flex flex-col items-start pb-2">
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-emerald-500 rounded text-[10px] font-bold ${inter.className}`}>
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Mastery
                        </span>
                        <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>Qualified Skills</span>
                      </div>
                    </div>
                  </div>
                  <Briefcase className="w-5 h-5 text-slate-500" />
                </div>

                {/* Progress Indicators */}
                <div className="mt-auto h-[120px] w-full flex flex-col justify-end gap-4 px-2 pb-2">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-700 uppercase">Technical Mastery</span>
                      <span className="text-[10px] font-bold text-slate-900">80%</span>
                    </div>
                    <div className="h-3 w-full bg-white/40 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-700 uppercase">Soft Skill Alignment</span>
                      <span className="text-[10px] font-bold text-slate-900">60%</span>
                    </div>
                    <div className="h-3 w-full bg-white/40 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-slate-950/70 rounded-full" style={{ width: '60%', backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 6px)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Skill Gaps */}
            <div className="max-w-7xl mx-auto w-full px-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Skill Gaps to Address</h3>
              <Card className="dashboard-card bg-white border border-slate-200 shadow-sm border-none p-6 space-y-4">
                {analysis.skillGaps.map((gap, idx) => {
                  const gapSize = gap.targetLevel - gap.currentLevel;
                  const percentage = (gap.currentLevel / gap.targetLevel) * 100;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold !text-slate-900">{gap.skill}</span>
                          <span className="text-xs !text-slate-900 ml-2">
                            {gap.currentLevel}/{gap.targetLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${gapSize === 0 ? 'bg-[#FACC15]/20 text-[#FACC15]' :
                            gapSize <= 2 ? 'bg-[#FF8C00]/20 text-[#FF8C00]' :
                              'bg-white/20 !text-black'
                            }`}>
                            {gapSize === 0 ? '✓ Met' : `↑ ${gapSize} levels`}
                          </span>
                          <span className="text-xs !text-slate-900">{gap.estimatedHours}h</span>
                        </div>
                      </div>
                      <TimelineBar
                        percentage={percentage}
                        color={getGapColor(gapSize)}
                      />
                      <p className="text-xs !text-slate-900">{gap.reason}</p>
                    </div>
                  );
                })}
              </Card>
            </div>

            {/* Strengths */}
            {analysis.matchedSkills.length > 0 && (
              <div className="max-w-7xl mx-auto w-full px-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Your Strengths</h3>
                <div className="grid grid-cols-3 gap-4">
                  {analysis.matchedSkills.map((skill, idx) => (
                    <div key={idx} className="dashboard-card border-none bg-white border border-slate-200 shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold !text-slate-900">{skill.skill}</span>
                        <span className="text-[#FACC15]">✓</span>
                      </div>
                      <div className="text-xs !text-slate-900 mt-1">
                        {skill.targetLevel} - {skill.status}/{skill.currentLevel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 max-w-4xl">
              <Button
                className="pill-button bg-white !text-black hover:bg-gray-200"
                onClick={() => setAnalysis(null)}
              >
                Analyze Different Role
              </Button>
              <Button
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 hover:shadow-lg transition-all border-none"
                onClick={() => router.push('/roadmap')}
              >
                Generate Roadmap →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
