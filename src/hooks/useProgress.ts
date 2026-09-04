import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, Pattern } from '@/types';
import { problems, badges } from '@/data/problems';

const STORAGE_KEY = 'bs-visualizer-progress';

const defaultProgress: UserProgress = {
  problemsSolved: [],
  problemsVisualized: [],
  patternsLearned: [],
  xp: 0,
  streak: 0,
  badges: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress({ ...defaultProgress, ...JSON.parse(stored) });
      } catch {
        // keep default
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const markVisualized = useCallback((problemId: number) => {
    setProgress((prev) => {
      if (prev.problemsVisualized.includes(problemId)) return prev;
      const newVisualized = [...prev.problemsVisualized, problemId];
      const problem = problems.find((p) => p.id === problemId);
      const newPatterns = problem && !prev.patternsLearned.includes(problem.pattern)
        ? [...prev.patternsLearned, problem.pattern]
        : prev.patternsLearned;
      const newBadges = [...prev.badges];
      if (newVisualized.length >= 1 && !newBadges.includes('bs-beginner')) newBadges.push('bs-beginner');
      if (newVisualized.length >= problems.length && !newBadges.includes('fang-ready')) newBadges.push('fang-ready');
      return {
        ...prev,
        problemsVisualized: newVisualized,
        patternsLearned: newPatterns,
        xp: prev.xp + 10,
        badges: newBadges,
      };
    });
  }, []);

  const markSolved = useCallback((problemId: number) => {
    setProgress((prev) => {
      if (prev.problemsSolved.includes(problemId)) return prev;
      const newSolved = [...prev.problemsSolved, problemId];
      const newBadges = [...prev.badges];
      if (newSolved.length >= problems.length && !newBadges.includes('fang-ready')) newBadges.push('fang-ready');
      return {
        ...prev,
        problemsSolved: newSolved,
        xp: prev.xp + 50,
        badges: newBadges,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  const completionPercentage = Math.round((progress.problemsVisualized.length / problems.length) * 100);

  return {
    progress,
    markVisualized,
    markSolved,
    resetProgress,
    completionPercentage,
    totalProblems: problems.length,
    availableBadges: badges,
  };
}
