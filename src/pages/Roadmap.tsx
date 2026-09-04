import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowDown, Trophy } from 'lucide-react';
import { roadmap, problems } from '@/data/problems';
import type { UserProgress } from '@/types';
import type { Page } from '@/components/Navbar';

interface RoadmapProps {
  progress: UserProgress;
  onNavigate: (page: Page) => void;
}

const fullRoadmap = [
  { title: 'Binary Search', active: true },
  { title: 'Two Pointers', active: false },
  { title: 'Sliding Window', active: false },
  { title: 'Stack', active: false },
  { title: 'Linked List', active: false },
  { title: 'Trees', active: false },
  { title: 'Graphs', active: false },
  { title: 'Dynamic Programming', active: false },
];

export function Roadmap({ progress, onNavigate }: RoadmapProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">FANG Interview Roadmap</h1>
        <p className="text-slate-500 dark:text-slate-400">Your learning journey from beginner to FANG-ready</p>
      </div>

      {/* Full roadmap overview */}
      <div className="card p-6 mb-8">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Complete DSA Journey</h2>
        <div className="flex flex-wrap items-center gap-2">
          {fullRoadmap.map((item, i) => (
            <div key={item.title} className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${item.active ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-surface-200 text-slate-500 dark:text-slate-500'}`}>
                {item.title}
              </div>
              {i < fullRoadmap.length - 1 && <ArrowDown className="h-3 w-3 text-slate-400 rotate-[-90deg]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Binary Search detailed roadmap */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Binary Search Progression</h2>
      <div className="space-y-4">
        {roadmap.map((level, i) => {
          const levelProblems = level.problemIds.map((id) => problems.find((p) => p.id === id)).filter(Boolean);
          const solvedCount = levelProblems.filter((p) => p && progress.problemsSolved.includes(p.id)).length;
          const visualizedCount = levelProblems.filter((p) => p && progress.problemsVisualized.includes(p.id)).length;
          const totalCount = levelProblems.length;
          const pct = totalCount > 0 ? Math.round((visualizedCount / totalCount) * 100) : 0;
          const isComplete = visualizedCount === totalCount && totalCount > 0;

          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isComplete ? 'bg-success-500' : 'bg-primary-100 dark:bg-primary-500/20'}`}>
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{level.level}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">{level.title}</h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-500">{pct}%</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{level.description}</p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {level.topics.map((topic) => (
                      <span key={topic} className="badge bg-slate-100 dark:bg-surface-200 text-slate-600 dark:text-slate-400">
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-surface-300 overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    />
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {visualizedCount} / {totalCount} problems visualized
                  </div>
                </div>
              </div>

              {i < roadmap.length - 1 && (
                <div className="flex justify-center mt-4">
                  <ArrowDown className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Final badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-8 card p-8 text-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20"
      >
        <Trophy className="h-12 w-12 text-warning-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">FANG Interview Ready</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Complete all levels to earn the "FANG Ready" badge
        </p>
        <button
          onClick={() => onNavigate('problems')}
          className="inline-flex items-center gap-2 btn-primary"
        >
          Continue Practicing
        </button>
      </motion.div>
    </div>
  );
}
