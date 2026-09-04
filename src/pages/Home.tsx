import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Zap, BookOpen, Target, TrendingUp, Code2, Eye } from 'lucide-react';
import type { Page } from '@/components/Navbar';
import { binarySearch } from '@/algorithms/binarySearch';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

function HeroAnimation() {
  const steps = binarySearch.generateSteps(binarySearch.getDefaultInput());
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= steps.length - 1) return 0;
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  const step = steps[stepIdx];
  const array = binarySearch.getDefaultInput().array;

  return (
    <div className="flex flex-wrap items-end justify-center gap-2">
      {array.map((value, i) => {
        const el = step?.array[i];
        const state = el?.state || 'default';
        const styles: Record<string, string> = {
          default: 'bg-slate-100 dark:bg-surface-200 border-slate-300 dark:border-surface-400 text-slate-600 dark:text-slate-400',
          'active-range': 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400',
          low: 'bg-success-100 dark:bg-success-500/20 border-success-500 text-success-700 dark:text-success-300',
          mid: 'bg-warning-100 dark:bg-warning-500/20 border-warning-500 text-warning-700 dark:text-warning-300 shadow-lg shadow-warning-500/30',
          high: 'bg-accent-100 dark:bg-accent-500/20 border-accent-500 text-accent-700 dark:text-accent-300',
          eliminated: 'bg-slate-50 dark:bg-surface-100 border-slate-200 dark:border-surface-300 text-slate-400 dark:text-slate-600 opacity-40',
          found: 'bg-success-500 border-success-600 text-white shadow-xl shadow-success-500/50',
          target: 'bg-primary-100 dark:bg-primary-500/20 border-primary-500 text-primary-700 dark:text-primary-300',
        };

        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-4 text-[9px] font-mono font-semibold">
              {step && el?.index === step.low && step.result !== 'found' && (
                <span className="text-success-500">low</span>
              )}
            </div>
            <motion.div
              animate={{
                scale: state === 'mid' || state === 'found' ? 1.15 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border-2 font-mono font-bold text-base transition-all duration-500 ${styles[state]}`}
            >
              {value}
            </motion.div>
            <div className="h-4 text-[9px] font-mono font-semibold">
              {step && el?.index === step.high && step.high !== step.low && step.result !== 'found' && (
                <span className="text-accent-500">high</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Home({ onNavigate }: HomeProps) {
  const features = [
    { icon: Eye, title: 'Step-by-Step Visualization', desc: 'Watch binary search execute in real-time with animated pointers' },
    { icon: Code2, title: 'Multi-Language Code', desc: 'See C, C++, and Java implementations synced with visualization' },
    { icon: Target, title: 'FANG Interview Patterns', desc: 'Learn the patterns behind common interview problems' },
    { icon: TrendingUp, title: 'Progress Tracking', desc: 'Track your journey from beginner to FANG-ready' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 mb-6">
              <Zap className="h-3.5 w-3.5 text-primary-500" />
              <span className="text-xs font-medium text-primary-700 dark:text-primary-400">Interactive DSA Learning Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-slate-900 dark:text-white mb-6">
              Understand Binary Search.
              <br />
              <span className="gradient-text">Don't Just Memorize It.</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Visualize algorithms step-by-step, recognize interview patterns, and prepare for FANG/FAANG interviews with interactive, hands-on practice.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('visualizer')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-200 active:scale-95 shadow-xl shadow-primary-600/30"
              >
                <Play className="h-5 w-5" />
                Start Visualizing
              </button>
              <button
                onClick={() => onNavigate('problems')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-surface-200 hover:bg-slate-200 dark:hover:bg-surface-300 text-slate-700 dark:text-slate-300 font-semibold transition-all duration-200 active:scale-95"
              >
                Explore Problems
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* Hero animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 card p-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Live Demo: Binary Search for 23</span>
              <span className="text-xs font-mono text-slate-400">auto-playing</span>
            </div>
            <HeroAnimation />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700/40 transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10 mb-4">
                <feature.icon className="h-5 w-5 text-primary-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 p-10 sm:p-16 text-center"
        >
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <BookOpen className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Master Binary Search?</h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              Start with the fundamentals and work your way through FANG interview patterns.
            </p>
            <button
              onClick={() => onNavigate('visualizer')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-600 font-semibold hover:bg-primary-50 transition-all duration-200 active:scale-95 shadow-xl"
            >
              <Play className="h-5 w-5" />
              Launch Visualizer
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
