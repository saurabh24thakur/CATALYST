'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, Circle } from 'lucide-react';
import { api } from '@/lib/api';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  prerequisites: string[];
  isUnlocked: boolean;
  position: { x: number; y: number };
}

interface SkillTreeProps {
  userId: string;
  onSkillSelect: (skillId: string) => void;
}

export default function SkillTree({ userId, onSkillSelect }: SkillTreeProps) {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkillTree();
  }, [userId]);

  const loadSkillTree = async () => {
    try {
      const data = await api.getSkillTree(userId);
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Failed to load skill tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'intermediate': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'advanced': return 'bg-rose-50 text-rose-600 border-rose-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Skill Tree
        </h2>
        <p className="text-sm text-slate-500 mt-1">Choose your path to mastery</p>
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <Card
            key={skill.id}
            className={`
              border transition-all duration-300 cursor-pointer shadow-sm
              ${skill.isUnlocked
                ? 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                : 'bg-slate-50 border-slate-200 opacity-60'
              }
            `}
            onClick={() => skill.isUnlocked && onSkillSelect(skill.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {skill.isUnlocked ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                    <CardTitle className="text-lg text-slate-900">{skill.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-500">{skill.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline" className={getDifficultyColor(skill.difficulty)}>
                    {skill.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
                    {skill.xpReward} XP
                  </Badge>
                </div>
                {!skill.isUnlocked && skill.prerequisites.length > 0 && (
                  <span className="text-xs text-slate-500">
                    🔒 Prerequisites required
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
