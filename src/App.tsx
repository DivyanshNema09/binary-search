import { useState, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import type { Page } from '@/components/Navbar';
import { Home } from '@/pages/Home';
import { Visualizer } from '@/pages/Visualizer';
import { Problems } from '@/pages/Problems';
import { Learn } from '@/pages/Learn';
import { Roadmap } from '@/pages/Roadmap';
import { Progress } from '@/pages/Progress';
import { useTheme } from '@/hooks/useTheme';
import { useProgress } from '@/hooks/useProgress';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [visualizerAlgorithm, setVisualizerAlgorithm] = useState<string>('binary-search');
  const { theme, toggleTheme } = useTheme();
  const { progress, markVisualized, markSolved, resetProgress, completionPercentage, totalProblems } = useProgress();

  const handleNavigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleVisualize = useCallback((algorithmId: string) => {
    setVisualizerAlgorithm(algorithmId);
    setPage('visualizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-0 text-slate-900 dark:text-slate-100">
      {page !== 'home' && (
        <Navbar
          currentPage={page}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      <main>
        {page === 'home' && (
          <>
            <Navbar
              currentPage={page}
              onNavigate={handleNavigate}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
            <Home onNavigate={handleNavigate} />
          </>
        )}
        {page === 'visualizer' && (
          <Visualizer
            algorithmId={visualizerAlgorithm}
            onAlgorithmChange={setVisualizerAlgorithm}
          />
        )}
        {page === 'problems' && (
          <Problems
            onVisualize={handleVisualize}
            progress={progress}
            onMarkVisualized={markVisualized}
            onMarkSolved={markSolved}
          />
        )}
        {page === 'learn' && <Learn onNavigate={handleNavigate} />}
        {page === 'roadmap' && <Roadmap progress={progress} onNavigate={handleNavigate} />}
        {page === 'progress' && (
          <Progress
            progress={progress}
            completionPercentage={completionPercentage}
            totalProblems={totalProblems}
            onResetProgress={resetProgress}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-surface-300 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Binary Search Visualizer — Understand, don't just memorize.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
