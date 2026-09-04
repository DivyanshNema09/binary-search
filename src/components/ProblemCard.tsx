import { motion } from 'framer-motion';
import { Eye, Code2, CheckCircle2, Circle } from 'lucide-react';
import type { Problem } from '@/types';

interface ProblemCardProps {
  problem: Problem;
  isSolved: boolean;
  isVisualized: boolean;
  onVisualize: () => void;
  onSolve: () => void;
}

export function ProblemCard({ problem, isSolved, isVisualized, onVisualize, onSolve }: ProblemCardProps) {
  const difficultyClass = problem.difficulty === 'Easy' ? 'badge-easy' : problem.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="card p-5 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400 dark:text-slate-600">#{problem.leetcodeId}</span>
          <span className={`badge ${difficultyClass}`}>{problem.difficulty}</span>
        </div>
        <div className="flex items-center gap-1">
          {isSolved ? (
            <CheckCircle2 className="h-5 w-5 text-success-500" />
          ) : isVisualized ? (
            <Circle className="h-5 w-5 text-primary-500 fill-primary-500/20" />
          ) : null}
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">{problem.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{problem.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
          {problem.pattern}
        </span>
        {problem.companies.slice(0, 3).map((company) => (
          <span key={company} className="badge bg-slate-100 text-slate-600 dark:bg-surface-200 dark:text-slate-400">
            {company}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onVisualize}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-all duration-200 active:scale-95"
        >
          <Eye className="h-4 w-4" />
          Visualize
        </button>
        <button
          onClick={onSolve}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-surface-200 hover:bg-slate-200 dark:hover:bg-surface-300 text-slate-700 dark:text-slate-300 text-sm font-medium transition-all duration-200 active:scale-95"
        >
          <Code2 className="h-4 w-4" />
          Solve
        </button>
      </div>
    </motion.div>
  );
}
