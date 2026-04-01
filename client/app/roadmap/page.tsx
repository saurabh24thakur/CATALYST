'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  ExternalLink,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Map as MapIcon,
  BrainCircuit,
  Rocket,
  Code,
  User,
  ChevronRight,
  Sparkles,
  Upload
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import MetricCard from '@/components/ui/metric-card';
import TimelineBar from '@/components/ui/timeline-bar';
import ReadinessAreaChart from '@/components/ui/readiness-area-chart';
import SkillsDistributionChart from '@/components/ui/skills-distribution-chart';

interface Resource {
  title: string;
  url: string;
  type: string;
  duration: string;
}

interface WeekPlan {
  week: number;
  title: string;
  skill?: string;
  skills?: string[];
  topics?: string[];
  estimatedHours: number;
  resources: Resource[];
  practiceProject: string;
  milestones: string[];
  completed?: boolean;
}

interface Roadmap {
  totalWeeks: number;
  totalHours: number;
  weeklyPlan: WeekPlan[];
  milestones: any[];
}

interface Project {
  title: string;
  technologies: string[];
  role: string;
  keyContributions: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

export default function RoadmapPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('roadmap');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState('');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  // Project Quiz States
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadingProjects, setUploadingProjects] = useState(false);

  useEffect(() => {
    const savedRoadmap = localStorage.getItem('roadmap');
    if (savedRoadmap) {
      setRoadmap(JSON.parse(savedRoadmap));
    }

    const savedProjects = localStorage.getItem('extracted_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleGenerate = async () => {
    const gapAnalysis = localStorage.getItem('gap_analysis');
    const targetRole = localStorage.getItem('target_role');

    if (!gapAnalysis) {
      router.push('/analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const analysis = JSON.parse(gapAnalysis);

      const response = await fetch(`${API_BASE_URL}/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillGaps: analysis.skillGaps,
          targetRole,
          availableHoursPerWeek: hoursPerWeek
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roadmap');
      }

      setRoadmap(data.roadmap);
      localStorage.setItem('roadmap', JSON.stringify(data.roadmap));

    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractProjects = async (providedFile?: File) => {
    const resumeText = localStorage.getItem('resumeText');

    if (!providedFile && !resumeText) {
      return;
    }

    setUploadingProjects(true);

    try {
      let response;
      if (providedFile) {
        const formData = new FormData();
        formData.append('resume', providedFile);
        response = await fetch(`${API_BASE_URL}/resume/extract-projects`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/resume/extract-projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText }),
        });
      }

      const data = await response.json();
      if (response.ok) {
        setProjects(data.projects);
        localStorage.setItem('extracted_projects', JSON.stringify(data.projects));
      } else {
        alert(data.error || 'Failed to extract projects');
      }
    } catch (error) {
      console.error('Extraction error:', error);
      alert('Failed to process resume');
    } finally {
      setUploadingProjects(false);
    }
  };

  // Automatically trigger sync if text is available but no projects are stored
  useEffect(() => {
    if (activeTab === 'quiz' && !projects && !uploadingProjects) {
      const resumeText = localStorage.getItem('resumeText');
      if (resumeText) {
        handleExtractProjects();
      }
    }
  }, [activeTab, projects]);

  const toggleWeekCompletion = (weekIndex: number) => {
    if (!roadmap) return;

    const updated = { ...roadmap };
    updated.weeklyPlan[weekIndex].completed = !updated.weeklyPlan[weekIndex].completed;
    setRoadmap(updated);
    localStorage.setItem('roadmap', JSON.stringify(updated));
  };

  const completedWeeks = roadmap?.weeklyPlan.filter(w => w.completed).length || 0;
  const progressPercentage = roadmap ? (completedWeeks / roadmap.totalWeeks) * 100 : 0;

  // Prepare data for charts
  const completionData = [
    { name: 'Start', score: 0 },
    { name: 'Current', score: progressPercentage }
  ];

  const weeksDistributionData = roadmap ? [
    { name: 'Completed', value: completedWeeks },
    { name: 'Remaining', value: roadmap.totalWeeks - completedWeeks }
  ] : [];

  const hoursData = [
    { name: 'Week 1', score: 5 },
    { name: 'Week 2', score: 8 },
    { name: 'Week 3', score: 12 },
    { name: 'Week 4', score: 15 },
    { name: 'Week 5', score: 10 },
    { name: 'Target', score: hoursPerWeek }
  ];

  return (
    <div className="min-h-screen pb-20 pl-20 bg-slate-50/50">
      <div className="p-8 flex flex-col items-center w-full">
        {/* Header Section */}
        <div className="mb-16 mt-12 text-center flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
          <h1 className="text-5xl md:text-6xl font-black !text-slate-900 mb-6 tracking-tight leading-tight">Your Skill Evalution</h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">From strategic gaps to tactical mastery—your journey is charted here.</p>

          {/* Tab Selector */}
          <div className="mt-8 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-white shadow-inner">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all
                  ${activeTab === 'roadmap'
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-105'
                    : 'text-slate-500 hover:text-slate-900'
                  }
                `}
              >
                <MapIcon className="w-4 h-4" />
                Learning Roadmap
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all
                  ${activeTab === 'quiz'
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-105 transition-all'
                    : 'text-slate-500 hover:text-slate-900'
                  }
                `}
              >
                <BrainCircuit className="w-4 h-4" />
                Project Intelligence
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'roadmap' ? (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full"
            >
              {!roadmap ? (
                <div className="max-w-2xl mx-auto">
                  <Card className="dashboard-card bg-white border border-slate-200 shadow-sm border-none p-8 space-y-6">
                    <div>
                      <label className="text-lg !text-slate-900 mb-4 block font-bold">
                        Available Hours Per Week
                      </label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          min="5"
                          max="40"
                          value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                          className="bg-transparent border-slate-300 text-slate-900 text-3xl font-bold text-center w-32 h-16 rounded-2xl"
                        />
                        <span className="text-lg font-medium text-slate-500">hours/week</span>
                      </div>
                    </div>

                    <Button
                      className="flex items-center justify-center gap-2 px-6 py-8 bg-slate-900 text-white rounded-[2rem] text-xl font-bold hover:bg-slate-800 hover:shadow-2xl transition-all border-none w-full shadow-xl shadow-slate-900/20"
                      onClick={handleGenerate}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                          Plotting Course...
                        </>
                      ) : (
                        'Forge My Roadmap'
                      )}
                    </Button>

                    {error && (
                      <div className="text-red-500 font-medium text-sm text-center">{error}</div>
                    )}
                  </Card>
                </div>
              ) : (
                <div className="space-y-12 w-full">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-4">
                    <div className="dashboard-card p-8 bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-sm transform hover:-translate-y-2 transition-all duration-500">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Completion Curve</h3>
                      <ReadinessAreaChart data={completionData} color="#7FFF00" className="h-[180px]" />
                      <div className="flex items-baseline gap-2 mt-6">
                        <span className="text-5xl font-bold text-slate-900 tracking-tighter">{Math.round(progressPercentage)}%</span>
                        <span className="text-sm font-bold text-emerald-500">Done</span>
                      </div>
                    </div>

                    <div className="dashboard-card p-8 bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-sm transform hover:-translate-y-2 transition-all duration-500">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Effort Density</h3>
                      <SkillsDistributionChart data={weeksDistributionData} colors={['#22C55E', '#cbd5e1']} className="h-[180px]" />
                      <div className="flex items-baseline gap-2 mt-6">
                        <span className="text-5xl font-bold text-slate-900 tracking-tighter">{roadmap.totalWeeks - completedWeeks}</span>
                        <span className="text-sm font-bold text-slate-400">Weeks to go</span>
                      </div>
                    </div>

                    <div className="dashboard-card p-8 bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-sm transform hover:-translate-y-2 transition-all duration-500">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Workload Balance</h3>
                      <ReadinessAreaChart data={hoursData} color="#FACC15" className="h-[180px]" />
                      <div className="flex items-baseline gap-2 mt-6">
                        <span className="text-5xl font-bold text-slate-900 tracking-tighter">{hoursPerWeek}</span>
                        <span className="text-sm font-bold text-slate-400">Total hours/wk</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="max-w-7xl mx-auto w-full px-4">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1.5 h-8 bg-slate-900 rounded-full"></div>
                      <h3 className="text-2xl font-bold !text-slate-900 tracking-tight">Timeline Execution</h3>
                    </div>

                    <Card className="dashboard-card bg-white/70 backdrop-blur-xl border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] border-none p-10 space-y-10 rounded-[3rem]">
                      {roadmap.weeklyPlan.map((week, idx) => (
                        <div key={idx} className="space-y-6 relative">
                          {idx !== roadmap.weeklyPlan.length - 1 && (
                            <div className="absolute left-[11px] top-8 bottom-[-40px] w-0.5 bg-slate-100"></div>
                          )}
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                              <button onClick={() => toggleWeekCompletion(idx)} className="relative z-10 transition-transform active:scale-95">
                                {week.completed ? (
                                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-white group-hover:border-slate-900 transition-colors"></div>
                                )}
                              </button>
                              <span className={`text-xl font-bold tracking-tight transition-all ${week.completed ? 'text-emerald-500' : 'text-slate-900'}`}>
                                Week {week.week}: {week.title}
                              </span>
                            </div>
                            <button
                              onClick={() => setExpandedWeek(expandedWeek === idx ? null : idx)}
                              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
                            >
                              {expandedWeek === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>

                          <TimelineBar
                            percentage={week.completed ? 100 : idx === 0 ? 50 : 0}
                            color={week.completed ? 'green' : idx === 0 ? 'slate' : 'white'}
                            showPercentage={week.completed}
                          />

                          {expandedWeek === idx && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pl-12 space-y-8">
                              {/* Resources */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {week.resources.map((resource, rIdx) => (
                                  <a key={rIdx} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-900 hover:shadow-lg transition-all group/res">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-slate-50 rounded-lg group-hover/res:bg-slate-900 transition-colors">
                                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover/res:text-white" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-bold text-slate-900">{resource.title}</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{resource.type} • {resource.duration}</div>
                                      </div>
                                    </div>
                                  </a>
                                ))}
                              </div>

                              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                  <Rocket className="w-4 h-4" /> Lab Mission
                                </h4>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{week.practiceProject}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-6xl mx-auto"
            >
              {!projects ? (
                <Card className="dashboard-card bg-white/70 backdrop-blur-xl border border-white p-16 text-center rounded-[3rem] shadow-sm">
                  <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-900/20">
                    <Sparkles className="w-12 h-12 text-[#FACC15]" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Sync Project Artifacts</h2>
                  <p className="text-slate-500 mb-10 max-w-md mx-auto text-lg leading-relaxed">Let AI extract your live project experience from your resume to generate customized intelligence challenges.</p>

                  <div className="max-w-md mx-auto space-y-4">
                    <input type="file" id="resume-sync" className="hidden" accept=".pdf,.docx" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                    <label htmlFor="resume-sync" className="flex items-center justify-center gap-4 w-full p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-slate-900 hover:bg-slate-50/50 transition-all cursor-pointer group">
                      <Upload className="w-8 h-8 text-slate-300 group-hover:text-slate-900 transition-all" />
                      <span className="text-lg font-bold text-slate-400 group-hover:text-slate-900">
                        {file ? file.name : 'Select Resume File'}
                      </span>
                    </label>

                    {file && (
                      <Button
                        onClick={() => handleExtractProjects(file || undefined)}
                        disabled={uploadingProjects}
                        className="w-full h-16 bg-slate-900 text-white rounded-[2rem] text-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                      >
                        {uploadingProjects ? <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Syncing...</> : 'Initialize Sync'}
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, idx) => (
                    <Card key={idx} className="group relative bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-default transform hover:-translate-y-2">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-500">
                            <Code className="w-6 h-6 text-slate-400 group-hover:text-[#FACC15]" />
                          </div>
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${project.complexity === 'advanced' ? 'bg-amber-100 text-amber-600' :
                            project.complexity === 'intermediate' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                            {project.complexity}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{project.title}</h3>
                        <p className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
                          <User className="w-4 h-4" /> {project.role}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-[10px] font-bold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="relative z-10 w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group/btn"
                        onClick={() => alert(`Starting intelligence quiz for ${project.title}`)}
                      >
                        Challenge Intelligence
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>

                      {/* Abstract background symbol */}
                      <div className="absolute -bottom-10 -right-10 opacity-0 group-hover:opacity-5 transition-opacity duration-1000">
                        <Sparkles className="w-64 h-64 text-slate-900" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Bottom Actions */}
        <div className="flex flex-col md:flex-row gap-4 mt-20 w-full max-w-7xl mx-auto px-4">
          <Button
            className="flex-1 h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
            onClick={() => router.push('/dashboard')}
          >
            ← Back to Terminal
          </Button>
          <Button
            className="flex-1 h-14 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl font-bold hover:text-slate-900 transition-all shadow-sm"
            onClick={() => {
              localStorage.removeItem('roadmap');
              localStorage.removeItem('extracted_projects');
              localStorage.removeItem('resumeText');
              window.location.reload();
            }}
          >
            Reset Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
