'use client';

import { useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, Users, MessageCircle, Briefcase, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Quicksand, Inter } from 'next/font/google';

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

import MetricCard from '@/components/ui/metric-card';
import SkillsDonutChart from '@/components/ui/skills-donut-chart';
import SkillsDistributionChart from '@/components/ui/skills-distribution-chart';
import SkillsVerticalLollipopChart from '@/components/ui/skills-vertical-lollipop-chart';

interface Skill {
  name: string;
  category: string;
  proficiency: number;
  evidence: string;
}

interface SkillCategories {
  technical: Skill[];
  soft: Skill[];
  tools: Skill[];
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState<SkillCategories | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf' ||
      selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF or DOCX file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      console.log('Uploading to:', `${API_BASE_URL}/resume/upload`);
      const response = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 150));
        data = { error: `Server returned non-JSON response (Status: ${response.status})` };
      }

      console.log('Response data:', data);

      if (response.ok) {
        setSkills(data.skills);
        localStorage.setItem('extracted_skills', JSON.stringify(data.skills));
      } else {
        alert(data.error || `Upload failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const totalSkills = skills ?
    skills.technical.length + skills.soft.length + skills.tools.length : 0;

  // Prepare data for charts
  const donutData = skills?.soft.map(s => ({
    name: s.name,
    proficiency: s.proficiency,
  })) || [];

  const distributionData = skills ? [
    { name: 'Technical', value: skills.technical.length },
    { name: 'Soft', value: skills.soft.length },
    { name: 'Tools', value: skills.tools.length },
  ] : [];

  const barData = skills?.technical.slice(0, 7).map(s => ({
    name: s.name,
    proficiency: s.proficiency
  })) || [];

  return (
    <div className="">

      <div className="p-8 flex flex-col items-center justify-center mt-23">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-sm font-bold tracking-widest text-blue-600 mb-2">STEP 1 OF 3</div>
          <h1 className="text-4xl md:text-5xl font-bold !text-slate-900 mb-4">Upload Your Resume</h1>
          <p className="text-lg !text-slate-600">Let AI analyze your skills to build your roadmap</p>
        </div>

        {/* Upload Section */}
        {!skills ? (
          <div className="max-w-2xl">
            <Card className="dashboard-card bg-white border border-slate-200 shadow-sm border-none p-8 w-150">
              <div
                className={`
                  border-2 border-dashed rounded-2xl p-12 text-center transition-all
                  ${isDragging
                    ? 'border-[#7FFF00] bg-[#FACC15]/10'
                    : 'border-slate-300 hover:border-[#3a3a3a]'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 !text-black" />
                <h3 className="text-xl font-semibold !text-slate-900 mb-2">
                  {file ? file.name : 'Drag and drop your resume here'}
                </h3>
                <p className="!text-slate-900 mb-4">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'or click to browse'}
                </p>
                <p className="text-xs !text-slate-900 mb-6">Supports PDF and DOCX</p>

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileInput}
                />

                <div className="flex justify-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button
                      className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors border-none"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <FileText className="w-4 h-4" />
                      Choose File
                    </Button>
                  </label>
                </div>
              </div>

              {file && (
                <div className="mt-6 flex justify-end">
                  <Button
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors border-none"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="space-y-6 w-full max-w-6xl">
            {/* Rich Metrics Dashboard */}

            <div className="flex flex-col md:flex-row justify-center items-end gap-6 w-full mb-8">
              {/* Card 1: Skills Distribution (Purple) */}
              <div className={`data-card flex-1 min-w-[280px] bg-[#E5E4F9] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#8b5cf620] transform hover:-translate-y-2 transition-transform duration-500`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left">
                    <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Skills Distribution</p>
                    <div className="flex items-end gap-3">
                      <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>{totalSkills}</h3>
                      <div className="flex flex-col items-start pb-2">
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-emerald-500 rounded text-[10px] font-bold ${inter.className}`}>
                          <TrendingUp className="w-3 h-3" /> 100%
                        </span>
                        <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>Total Extracted</span>
                      </div>
                    </div>
                  </div>
                  <Users className="w-5 h-5 text-slate-500" />
                </div>

                {/* Stacked Chart (Col 1) */}
                <div className="mt-auto h-[120px] w-full flex items-end justify-between gap-2 px-0.5">
                  {(() => {
                    const maxVal = Math.max(...distributionData.map(d => d.value), 1);
                    return distributionData.map((d, i) => {
                      const h = (d.value / maxVal) * 100; // max 100px
                      return (
                        <div key={i} className="flex flex-col gap-1 w-full justify-end h-full items-center group relative">
                          <span className="absolute -top-6 text-[10px] bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{d.value} {d.name}</span>
                          <div className={`w-full rounded-[6px]`} style={{ height: `${h * 0.2}px`, minHeight: '8px', backgroundImage: 'radial-gradient(circle, #47556960 1.5px, transparent 1.5px)', backgroundSize: '6px 6px' }}></div>
                          <div className={`w-full rounded-[6px]`} style={{ height: `${h * 0.4}px`, minHeight: '12px', backgroundImage: 'repeating-linear-gradient(45deg, #47556940 0, #47556940 1.5px, transparent 1.5px, transparent 6px)' }}></div>
                          <div className={`w-full rounded-[6px] bg-gradient-to-b from-slate-600 to-[#1e1e28] shadow-sm`} style={{ height: `${h * 0.4}px`, minHeight: '16px' }}></div>
                          <span className={`text-[9px] uppercase font-bold text-slate-500 mt-1 truncate w-full text-center ${inter.className}`}>{d.name.substring(0, 4)}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Card 2: Top Technical Skills (Blue) */}
              <div className={`data-card flex-1 min-w-[280px] bg-[#Dceaf9] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#3b82f620] z-20 transform hover:-translate-y-2 transition-transform duration-500`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left">
                    <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Top Technical</p>
                    <div className="flex items-end gap-3">
                      <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>{barData.length}</h3>
                      <div className="flex flex-col items-start pb-2">
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-emerald-500 rounded text-[10px] font-bold ${inter.className}`}>
                          <TrendingUp className="w-3 h-3" /> Top
                        </span>
                        <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>Mastered Skills</span>
                      </div>
                    </div>
                  </div>
                  <MessageCircle className="w-5 h-5 text-slate-500" />
                </div>

                {/* Solid Chart (Col 2) */}
                <div className="mt-auto h-[120px] w-full flex items-end justify-between gap-1.5 px-0.5">
                  {(() => {
                    const maxVal = Math.max(...barData.map(d => d.proficiency || 0), 5);
                    const displayData = [...barData].slice(0, 6);
                    while (displayData.length < 6) {
                      displayData.push({ name: '-', proficiency: 0 });
                    }
                    return displayData.map((d, i) => {
                      const h = (d.proficiency / maxVal) * 90; // max 90px
                      return (
                        <div key={i} className="flex flex-col gap-1 w-full justify-end h-full items-center group relative">
                          {d.name !== '-' && <span className="absolute -top-6 text-[10px] bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{d.name}: {d.proficiency}</span>}
                          <div className={`w-full rounded-[6px] bg-gradient-to-b from-slate-600 to-[#1e1e28] shadow-sm transition-all duration-300 ${d.proficiency === 0 ? 'opacity-20' : ''}`} style={{ height: `${Math.max(12, h)}px` }}></div>
                          <span className={`text-[9px] uppercase font-bold text-slate-500 mt-1 truncate w-full text-center ${inter.className}`}>{d.name === '-' ? '' : d.name.substring(0, 4)}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Card 3: Soft Skills (Pink) */}
              <div className={`data-card flex-1 min-w-[280px] bg-[#F3D8EE] rounded-[2rem] p-6 h-[260px] flex flex-col justify-between shadow-[0_20px_50px_-10px_#ec489920] transform hover:-translate-y-2 transition-transform duration-500`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left">
                    <p className={`text-slate-700 font-bold mb-1 tracking-tight ${inter.className}`}>Soft Skills</p>
                    <div className="flex items-end gap-3">
                      <h3 className={`text-[44px] leading-none font-medium tracking-tight text-slate-800 ${quicksand.className}`}>{donutData.length}</h3>
                      <div className="flex flex-col items-start pb-2">
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 bg-white/70 text-emerald-500 rounded text-[10px] font-bold ${inter.className}`}>
                          <TrendingUp className="w-3 h-3" /> Top
                        </span>
                        <span className={`text-[9px] text-slate-500 font-medium whitespace-nowrap mt-1 tracking-wide ${inter.className}`}>Core Traits</span>
                      </div>
                    </div>
                  </div>
                  <Briefcase className="w-5 h-5 text-slate-500" />
                </div>

                {/* Stacked Chart (Col 3) */}
                <div className="mt-auto h-[120px] w-full flex items-end justify-between gap-1.5 px-0.5">
                  {(() => {
                    const maxVal = Math.max(...donutData.map(d => d.proficiency || 0), 5);
                    const displayData = [...donutData].slice(0, 6);
                    while (displayData.length < 6) {
                      displayData.push({ name: '-', proficiency: 0 });
                    }
                    return displayData.map((d, i) => {
                      const hHash = (d.proficiency / maxVal) * 50;
                      const hSolid = (d.proficiency / maxVal) * 40;
                      return (
                        <div key={i} className="flex flex-col gap-1 w-full justify-end h-full items-center group relative">
                          {d.name !== '-' && <span className="absolute -top-6 text-[10px] bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{d.name}: {d.proficiency}</span>}
                          <div className={`w-full rounded-[6px] ${d.proficiency === 0 ? 'opacity-20' : ''}`} style={{ height: `${Math.max(8, hHash)}px`, backgroundImage: 'repeating-linear-gradient(45deg, #47556940 0, #47556940 1.5px, transparent 1.5px, transparent 6px)' }}></div>
                          <div className={`w-full rounded-[6px] bg-gradient-to-b from-slate-600 to-[#1e1e28] shadow-sm transition-all duration-300 ${d.proficiency === 0 ? 'opacity-20' : ''}`} style={{ height: `${Math.max(12, hSolid)}px` }}></div>
                          <span className={`text-[9px] uppercase font-bold text-slate-500 mt-1 truncate w-full text-center ${inter.className}`}>{d.name === '-' ? '' : d.name.substring(0, 4)}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>


            {/* Skills Grid */}
            <div className="space-y-6">
              {/* Technical Skills */}
              {skills.technical.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold !text-slate-900 mb-4">Technical Skills</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.technical.map((skill, idx) => (
                      <div key={idx} className="dashboard-card bg-white border border-slate-200 shadow-sm p-4 border-none">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold !text-slate-900">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#FACC15]/20 text-[#FACC15]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs !text-slate-900 line-clamp-2">
                          {skill.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {skills.soft.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold !text-slate-900 mb-4">Soft Skills</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.soft.map((skill, idx) => (
                      <div key={idx} className="dashboard-card bg-white border border-slate-200 shadow-sm p-4 border-none">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold !text-slate-900">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#FF8C00]/20 text-[#FF8C00]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs !text-slate-900 line-clamp-2">
                          {skill.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {skills.tools.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold !text-slate-900 mb-4">Tools & Technologies</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.tools.map((skill, idx) => (
                      <div key={idx} className="dashboard-card bg-white border border-slate-200 shadow-sm p-4 border-none">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold !text-slate-900">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#FF8C00]/20 text-[#FF8C00]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs !text-slate-900 line-clamp-2">
                          {skill.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 max-w-4xl">
              <Button
                className="pill-button bg-white !text-black hover:bg-gray-200"
                onClick={() => {
                  setFile(null);
                  setSkills(null);
                }}
              >
                Upload Different Resume
              </Button>
              <Button
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 hover:shadow-lg transition-all border-none"
                onClick={() => router.push('/analyze')}
              >
                Next: Analyze Gap →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
