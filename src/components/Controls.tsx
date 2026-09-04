import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import type { PlayState } from '@/hooks/useVisualizer';

interface ControlsProps {
  playState: PlayState;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const speedOptions = [0.5, 1, 1.5, 2];

export function Controls({
  playState,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onPrev,
  onNext,
  onReset,
  onSpeedChange,
}: ControlsProps) {
  const isPlaying = playState === 'playing';
  const atStart = currentStep === 0;
  const atEnd = currentStep >= totalSteps - 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrev}
            disabled={atStart}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-surface-200 hover:bg-slate-200 dark:hover:bg-surface-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-90"
            title="Previous Step (←)"
          >
            <SkipBack className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={isPlaying ? onPause : onPlay}
            className="p-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30 transition-all duration-200"
            title="Play/Pause (Space)"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </motion.button>

          <button
            onClick={onNext}
            disabled={atEnd}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-surface-200 hover:bg-slate-200 dark:hover:bg-surface-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-90"
            title="Next Step (→)"
          >
            <SkipForward className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-surface-200 hover:bg-slate-200 dark:hover:bg-surface-300 transition-all duration-200 active:scale-90"
            title="Reset (R)"
          >
            <RotateCcw className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Speed</span>
          {speedOptions.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                speed === s
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'bg-slate-100 dark:bg-surface-200 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-surface-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Step {currentStep + 1} / {totalSteps}
        </span>
        <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-surface-300 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            initial={false}
            animate={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
    </div>
  );
}
