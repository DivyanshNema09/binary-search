import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizationStep } from '@/types';

interface ExplanationPanelProps {
  step: VisualizationStep;
  stepIndex: number;
  totalSteps: number;
}

export function ExplanationPanel({ step, stepIndex, totalSteps }: ExplanationPanelProps) {
  const resultConfig = {
    found: { icon: '✓', color: 'text-success-600 dark:text-success-400', bg: 'bg-success-50 dark:bg-success-500/10', label: 'Target Found' },
    'not-found': { icon: '✗', color: 'text-error-600 dark:text-error-400', bg: 'bg-error-50 dark:bg-error-500/10', label: 'Not Found' },
    'in-progress': { icon: '→', color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10', label: 'In Progress' },
  };

  const rc = resultConfig[step.result || 'in-progress'];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Step Explanation</span>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-500">
          Step {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rc.bg}`}>
        <span className={`text-lg font-bold ${rc.color}`}>{rc.icon}</span>
        <span className={`text-sm font-medium ${rc.color}`}>{rc.label}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-slate-200 dark:border-surface-300 bg-slate-50 dark:bg-surface-100 p-4"
        >
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {step.explanation}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
