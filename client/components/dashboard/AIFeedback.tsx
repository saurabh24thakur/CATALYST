'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target } from 'lucide-react';

interface AIFeedbackProps {
  currentScore: number;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
}

export default function AIFeedback({ currentScore, level, currentXP, xpToNextLevel }: AIFeedbackProps) {
  const xpPercentage = (currentXP / xpToNextLevel) * 100;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Live Feedback
        </h2>
        <p className="text-sm text-slate-500 mt-1">Track your progress in real-time</p>
      </div>

      {/* Level Card */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg text-slate-900">Level {level}</CardTitle>
            </div>
            <Badge className="bg-blue-50 text-blue-600 border-blue-200">
              Learner
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">XP Progress</span>
              <span className="font-semibold text-blue-600">{currentXP} / {xpToNextLevel}</span>
            </div>
            <Progress value={xpPercentage} className="h-3 bg-slate-100">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${xpPercentage}%` }}
              />
            </Progress>
            <p className="text-xs text-slate-500 text-center mt-2">
              {xpToNextLevel - currentXP} XP to Level {level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Score Card */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-lg text-slate-900">Current Score</CardTitle>
          </div>
          <CardDescription>Mission performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-slate-900">
              {currentScore}
            </div>
            <div className="text-slate-500 text-sm mt-1">out of 100</div>
            <div className="mt-4">
              <Progress value={currentScore} className="h-2 bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 rounded-full"
                  style={{ width: `${currentScore}%` }}
                />
              </Progress>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg text-slate-900">Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Correctness</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
              {currentScore > 70 ? 'Excellent' : currentScore > 40 ? 'Good' : 'Needs Work'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Approach</span>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
              {currentScore > 70 ? 'Best Practice' : currentScore > 40 ? 'Acceptable' : 'Review'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Communication</span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
              {currentScore > 70 ? 'Clear' : currentScore > 40 ? 'Moderate' : 'Unclear'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-amber-50 shadow-sm border border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-amber-900">💡 Pro Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-800">
            {currentScore < 50
              ? "Take your time to analyze the resources provided. Quality over speed!"
              : currentScore < 80
                ? "Great progress! Try to explain your reasoning more clearly."
                : "Outstanding work! You're mastering this skill. Ready for the next challenge?"
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
