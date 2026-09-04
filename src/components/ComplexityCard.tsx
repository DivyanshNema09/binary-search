import { Clock, Database, TrendingUp } from 'lucide-react';
import type { Complexity } from '@/types';
import { motion } from 'framer-motion';

interface ComplexityCardProps {
  complexity: Complexity;
}

export function ComplexityCard({ complexity }: ComplexityCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-surface-300 bg-slate-50 dark:bg-surface-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Time</span>
          </div>
          <div className="font-mono text-xl font-bold text-primary-600 dark:text-primary-400">{complexity.time}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-surface-300 bg-slate-50 dark:bg-surface-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-accent-500" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Space</span>
          </div>
          <div className="font-mono text-xl font-bold text-accent-600 dark:text-accent-400">{complexity.space}</div>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{complexity.description}</p>

      {/* Visual comparison: Linear vs Binary Search */}
      <div className="rounded-xl border border-slate-200 dark:border-surface-300 bg-slate-50 dark:bg-surface-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Visual Comparison</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">Linear Search O(n)</span>
              <span className="font-mono text-slate-500 dark:text-slate-500">1000 steps</span>
            </div>
            <div className="h-3 rounded-full bg-slate-200 dark:bg-surface-300 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-error-500 to-error-400 rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">Binary Search O(log n)</span>
              <span className="font-mono text-slate-500 dark:text-slate-500">~10 steps</span>
            </div>
            <div className="h-3 rounded-full bg-slate-200 dark:bg-surface-300 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '1%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-success-500 to-success-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
