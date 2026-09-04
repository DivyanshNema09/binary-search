import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizationStep } from '@/types';

interface VariablePanelProps {
  step: VisualizationStep;
}

export function VariablePanel({ step }: VariablePanelProps) {
  const variables = [
    { label: 'low', value: step.low, color: 'success' },
    { label: 'mid', value: step.mid === -1 ? '—' : step.mid, color: 'warning' },
    { label: 'high', value: step.high, color: 'accent' },
  ];

  const colorMap: Record<string, string> = {
    success: 'text-success-600 dark:text-success-400 border-success-500/30 bg-success-50 dark:bg-success-500/10',
    warning: 'text-warning-600 dark:text-warning-400 border-warning-500/30 bg-warning-50 dark:bg-warning-500/10',
    accent: 'text-accent-600 dark:text-accent-400 border-accent-500/30 bg-accent-50 dark:bg-accent-500/10',
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {variables.map((v) => (
          <div
            key={v.label}
            className={`rounded-xl border p-3 ${colorMap[v.color]}`}
          >
            <div className="text-xs font-mono uppercase tracking-wide opacity-70">{v.label}</div>
            <motion.div
              key={String(v.value)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="font-mono text-2xl font-bold"
            >
              {v.value}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-surface-300 bg-slate-50 dark:bg-surface-100 p-3">
          <div className="text-xs font-mono uppercase tracking-wide text-slate-500 dark:text-slate-500">target</div>
          <div className="font-mono text-xl font-bold text-slate-800 dark:text-slate-200">{step.target}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-surface-300 bg-slate-50 dark:bg-surface-100 p-3">
          <div className="text-xs font-mono uppercase tracking-wide text-slate-500 dark:text-slate-500">comparisons</div>
          <div className="font-mono text-xl font-bold text-slate-800 dark:text-slate-200">{step.comparisons ?? 0}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step.condition && (
          <motion.div
            key={step.condition}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-primary-200 dark:border-primary-700/50 bg-primary-50 dark:bg-primary-900/20 p-3"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400 mb-1">Current Condition</div>
            <div className="font-mono text-sm text-slate-700 dark:text-slate-300">{step.condition}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step.action && (
          <motion.div
            key={step.action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-accent-200 dark:border-accent-700/50 bg-accent-50 dark:bg-accent-900/20 p-3"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400 mb-1">Action</div>
            <div className="font-mono text-sm text-slate-700 dark:text-slate-300">{step.action}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
