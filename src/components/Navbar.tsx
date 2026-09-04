import { motion } from 'framer-motion';
import { Sun, Moon, Binary, Keyboard } from 'lucide-react';
import { useState } from 'react';

export type Page = 'home' | 'visualizer' | 'problems' | 'learn' | 'roadmap' | 'progress';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const navItems: { page: Page; label: string }[] = [
  { page: 'visualizer', label: 'Visualizer' },
  { page: 'problems', label: 'Problems' },
  { page: 'learn', label: 'Learn' },
  { page: 'roadmap', label: 'Roadmap' },
  { page: 'progress', label: 'Progress' },
];

export function Navbar({ currentPage, onNavigate, theme, onToggleTheme }: NavbarProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 glass-strong border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-200">
                <Binary className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
                Binary<span className="gradient-text">Search</span>
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.page
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-200'
                  }`}
                >
                  {item.label}
                  {currentPage === item.page && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcuts(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-200 transition-all duration-200"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-200 transition-all duration-200"
                title="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-slate-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto scrollbar-thin">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 dark:bg-surface-200 text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {showShortcuts && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowShortcuts(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'Space', action: 'Play / Pause' },
                { key: '←', action: 'Previous Step' },
                { key: '→', action: 'Next Step' },
                { key: 'R', action: 'Reset' },
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{s.action}</span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-surface-200 border border-slate-300 dark:border-surface-400 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="w-full mt-5 btn-secondary"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
