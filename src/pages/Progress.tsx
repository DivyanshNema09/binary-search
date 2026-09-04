import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Search, Crosshair, RotateCw, Target, Zap, TrendingUp, Award } from 'lucide-react';
import { problems, badges } from '@/data/problems';
import type { UserProgress } from '@/types';
import type { Page } from '@/components/Navbar';

interface ProgressProps {
  progress: UserProgress;
  completionPercentage: number;
  totalProblems: number;
  onResetProgress: () => void;
  onNavigate: (page: Page) => void;
}

const badgeIcons: Record<string, typeof Search> = {
  Search,
  Crosshair,
  RotateCw,
  Target,
  Trophy,
};

export function Progress({ progress, completionPercentage, totalProblems, onResetProgress, onNavigate }: ProgressProps) {
  const solvedCount = progress.problemsSolved.length;
  const visualizedCount = progress.problemsVisualized.length;
  const patternsLearned = progress.patternsLearned.length;

  const stats = [
    { label: 'Problems Solved', value: solvedCount, total: totalProblems, icon: Trophy, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    { label: 'Problems Visualized', value: visualizedCount, total: totalProblems, icon: Star, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    { label: 'Patterns Learned', value: patternsLearned, total: 6, icon: Zap, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-500/10' },
    { label: 'Total XP', value: progress.xp, icon: Flame, color: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-500/10' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Progress</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your journey to mastering binary search</p>
        </div>
        <button
          onClick={onResetProgress}
          className="btn-ghost text-sm"
        >
          Reset
        </button>
      </div>

      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Binary Search Mastery</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{visualizedCount} / {totalProblems} problems visualized</p>
            </div>
          </div>
          <span className="text-3xl font-bold gradient-text">{completionPercentage}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-200 dark:bg-surface-300 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {stat.value}{stat.total !== undefined && <span className="text-sm text-slate-400 dark:text-slate-600"> / {stat.total}</span>}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <div className="card p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Award className="h-5 w-5 text-warning-500" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Badges</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, i) => {
            const earned = progress.badges.includes(badge.id);
            const Icon = badgeIcons[badge.icon] || Award;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-4 transition-all duration-300 ${
                  earned
                    ? 'border-warning-300 dark:border-warning-500/40 bg-warning-50 dark:bg-warning-500/10'
                    : 'border-slate-200 dark:border-surface-300 bg-slate-50 dark:bg-surface-100 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${earned ? 'bg-warning-500' : 'bg-slate-300 dark:bg-surface-300'}`}>
                    <Icon className={`h-5 w-5 ${earned ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${earned ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                      {badge.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{badge.description}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">{badge.condition}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Problem breakdown */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-5">Problem Status</h2>
        <div className="space-y-2">
          {problems.map((problem) => {
            const solved = progress.problemsSolved.includes(problem.id);
            const visualized = progress.problemsVisualized.includes(problem.id);
            return (
              <div
                key={problem.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-surface-300 bg-slate-50 dark:bg-surface-100 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400">#{problem.leetcodeId}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{problem.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {visualized && (
                    <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
                      <Star className="h-3 w-3" />
                      Visualized
                    </span>
                  )}
                  {solved && (
                    <span className="badge badge-easy">
                      <Trophy className="h-3 w-3" />
                      Solved
                    </span>
                  )}
                  {!visualized && !solved && (
                    <span className="text-xs text-slate-400 dark:text-slate-600">Not started</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={() => onNavigate('problems')}
          className="inline-flex items-center gap-2 btn-primary"
        >
          Continue Practicing
        </button>
      </div>
    </div>
  );
}
