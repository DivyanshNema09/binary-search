import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Settings, Lightbulb, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { ArrayVisualizer } from '@/components/ArrayVisualizer';
import { CodeViewer } from '@/components/CodeViewer';
import { VariablePanel } from '@/components/VariablePanel';
import { ExplanationPanel } from '@/components/ExplanationPanel';
import { Controls } from '@/components/Controls';
import { ComplexityCard } from '@/components/ComplexityCard';
import { CustomInput } from '@/components/CustomInput';
import { useVisualizer } from '@/hooks/useVisualizer';
import { algorithms } from '@/algorithms';
import type { Algorithm, AlgorithmInput, Language } from '@/types';

interface VisualizerProps {
  algorithmId?: string;
  onAlgorithmChange?: (id: string) => void;
}

export function Visualizer({ algorithmId = 'binary-search', onAlgorithmChange }: VisualizerProps) {
  const [algorithm, setAlgorithm] = useState<Algorithm>(algorithms[algorithmId] || algorithms['binary-search']);
  const [input, setInput] = useState<AlgorithmInput>(algorithms[algorithmId]?.getDefaultInput() || algorithms['binary-search'].getDefaultInput());
  const [language, setLanguage] = useState<Language>('java');
  const [showSettings, setShowSettings] = useState(false);
  const [showInterviewTip, setShowInterviewTip] = useState(false);

  const steps = useMemo(() => algorithm.generateSteps(input), [algorithm, input]);
  const viz = useVisualizer(steps);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        viz.togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        viz.prev();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        viz.next();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        viz.reset();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viz]);

  const handleAlgorithmChange = useCallback((id: string) => {
    const algo = algorithms[id];
    if (algo) {
      setAlgorithm(algo);
      setInput(algo.getDefaultInput());
      onAlgorithmChange?.(id);
    }
  }, [onAlgorithmChange]);

  const handleApplyInput = useCallback((newInput: AlgorithmInput) => {
    setInput(newInput);
    viz.reset();
  }, [viz]);

  const code = algorithm.getCode(language);
  const isKoko = algorithm.id === 'koko-eating-bananas';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{algorithm.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{algorithm.pattern}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={algorithm.id}
            onChange={(e) => handleAlgorithmChange(e.target.value)}
            className="input-field text-sm font-medium cursor-pointer max-w-[200px]"
          >
            {Object.values(algorithms).map((algo) => (
              <option key={algo.id} value={algo.id}>{algo.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-xl transition-all duration-200 ${showSettings ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-surface-200 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-surface-300'}`}
            title="Custom Input"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card p-5 mb-6 overflow-hidden"
        >
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Custom Input</h3>
          <CustomInput
            array={input.array}
            target={input.target}
            extra={input.extra}
            onApply={handleApplyInput}
            showTarget={algorithm.id !== 'find-peak-element'}
            showHours={isKoko}
            needsSorted={algorithm.id !== 'find-peak-element' && algorithm.id !== 'search-in-rotated-sorted-array'}
          />
        </motion.div>
      )}

      {/* Main visualization area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Visualization + Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Array visualization */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Array Visualization</h2>
              {viz.step.result === 'found' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="badge badge-easy"
                >
                  <Target className="h-3 w-3" />
                  Target Found
                </motion.span>
              )}
              {viz.step.result === 'not-found' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="badge badge-hard"
                >
                  Not Found
                </motion.span>
              )}
            </div>
            <ArrayVisualizer
              elements={viz.step.array}
              low={viz.step.low}
              mid={viz.step.mid}
              high={viz.step.high}
              result={viz.step.result}
            />
          </div>

          {/* Controls */}
          <div className="card p-5">
            <Controls
              playState={viz.playState}
              currentStep={viz.currentStep}
              totalSteps={viz.totalSteps}
              speed={viz.speed}
              onPlay={viz.play}
              onPause={viz.pause}
              onPrev={viz.prev}
              onNext={viz.next}
              onReset={viz.reset}
              onSpeedChange={viz.setSpeed}
            />
          </div>

          {/* Variable panel */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Variable Tracking</h2>
            <VariablePanel step={viz.step} />
          </div>

          {/* Explanation */}
          <div className="card p-5">
            <ExplanationPanel step={viz.step} stepIndex={viz.currentStep} totalSteps={viz.totalSteps} />
          </div>
        </div>

        {/* Right: Code + Complexity */}
        <div className="flex flex-col gap-6">
          {/* Code viewer */}
          <div className="card overflow-hidden lg:sticky lg:top-20">
            <div className="h-[400px]">
              <CodeViewer
                code={code}
                activeLine={viz.step.activeLine}
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </div>

          {/* Complexity */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Complexity Analysis</h2>
            <ComplexityCard complexity={algorithm.getComplexity()} />
          </div>

          {/* Interview tip */}
          <div className="card p-5">
            <button
              onClick={() => setShowInterviewTip(!showInterviewTip)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Interview Tip</span>
              </div>
              {showInterviewTip ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {showInterviewTip && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
              >
                {algorithm.description}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
