import { motion, AnimatePresence } from 'framer-motion';
import type { ArrayElementState } from '@/types';

interface ArrayVisualizerProps {
  elements: ArrayElementState[];
  low: number;
  mid: number;
  high: number;
  result?: 'found' | 'not-found' | 'in-progress';
}

const stateStyles: Record<string, { bg: string; border: string; text: string; shadow: string }> = {
  default: {
    bg: 'bg-slate-100 dark:bg-surface-200',
    border: 'border-slate-300 dark:border-surface-400',
    text: 'text-slate-700 dark:text-slate-300',
    shadow: '',
  },
  'active-range': {
    bg: 'bg-primary-50 dark:bg-primary-900/20',
    border: 'border-primary-300 dark:border-primary-700',
    text: 'text-primary-700 dark:text-primary-300',
    shadow: '',
  },
  low: {
    bg: 'bg-success-100 dark:bg-success-500/20',
    border: 'border-success-500 dark:border-success-400',
    text: 'text-success-700 dark:text-success-300',
    shadow: 'shadow-md shadow-success-500/30',
  },
  mid: {
    bg: 'bg-warning-100 dark:bg-warning-500/20',
    border: 'border-warning-500 dark:border-warning-400',
    text: 'text-warning-700 dark:text-warning-300',
    shadow: 'shadow-lg shadow-warning-500/40 ring-2 ring-warning-400/50',
  },
  high: {
    bg: 'bg-accent-100 dark:bg-accent-500/20',
    border: 'border-accent-500 dark:border-accent-400',
    text: 'text-accent-700 dark:text-accent-300',
    shadow: 'shadow-md shadow-accent-500/30',
  },
  target: {
    bg: 'bg-primary-100 dark:bg-primary-500/20',
    border: 'border-primary-500 dark:border-primary-400',
    text: 'text-primary-700 dark:text-primary-300',
    shadow: 'shadow-md shadow-primary-500/30',
  },
  eliminated: {
    bg: 'bg-slate-50 dark:bg-surface-100',
    border: 'border-slate-200 dark:border-surface-300',
    text: 'text-slate-400 dark:text-slate-600',
    shadow: 'opacity-40',
  },
  found: {
    bg: 'bg-success-500',
    border: 'border-success-600',
    text: 'text-white',
    shadow: 'shadow-xl shadow-success-500/50 ring-4 ring-success-400/30',
  },
};

export function ArrayVisualizer({ elements, low, mid, high, result }: ArrayVisualizerProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-3">
        {elements.map((el, i) => {
          const style = stateStyles[el.state] || stateStyles.default;
          const showLowLabel = el.index === low && result !== 'found';
          const showMidLabel = el.index === mid && mid !== -1 && result !== 'found';
          const showHighLabel = el.index === high && result !== 'found' && high !== low;

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-5 text-[10px] font-mono font-semibold flex flex-col items-center justify-end gap-0.5">
                <AnimatePresence mode="wait">
                  {showLowLabel && (
                    <motion.span
                      key="low"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-success-600 dark:text-success-400"
                    >
                      low
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {showMidLabel && (
                    <motion.span
                      key="mid"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-warning-600 dark:text-warning-400"
                    >
                      mid
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {showHighLabel && (
                    <motion.span
                      key="high"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-accent-600 dark:text-accent-400"
                    >
                      high
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border-2 font-mono font-bold text-lg transition-all duration-300 ${style.bg} ${style.border} ${style.text} ${style.shadow}`}
              >
                {el.value}
                <span className="absolute -top-1 -right-1 text-[9px] font-sans font-normal opacity-50">
                  {el.index}
                </span>
              </motion.div>

              <div className="h-5">
                {el.state === 'found' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[10px] font-mono font-bold text-success-600 dark:text-success-400"
                  >
                    FOUND
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-success-500 bg-success-100 dark:bg-success-500/20" />
          <span className="text-slate-600 dark:text-slate-400">low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-warning-500 bg-warning-100 dark:bg-warning-500/20" />
          <span className="text-slate-600 dark:text-slate-400">mid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-accent-500 bg-accent-100 dark:bg-accent-500/20" />
          <span className="text-slate-600 dark:text-slate-400">high</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-slate-300 bg-slate-100 dark:bg-surface-200 dark:border-surface-400 opacity-40" />
          <span className="text-slate-600 dark:text-slate-400">eliminated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-success-600 bg-success-500" />
          <span className="text-slate-600 dark:text-slate-400">found</span>
        </div>
      </div>
    </div>
  );
}
