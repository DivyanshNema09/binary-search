import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { ProblemCard } from '@/components/ProblemCard';
import { problems } from '@/data/problems';
import type { Difficulty, Pattern } from '@/types';
import type { Page } from '@/components/Navbar';
import type { UserProgress } from '@/types';

interface ProblemsProps {
  onVisualize: (algorithmId: string) => void;
  progress: UserProgress;
  onMarkVisualized: (problemId: number) => void;
  onMarkSolved: (problemId: number) => void;
}

const patterns: (Pattern | 'All')[] = ['All', 'Basic Binary Search', 'Boundary Search', 'Rotated Array', 'Binary Search on Answer', 'Peak Finding'];
const difficulties: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];

export function Problems({ onVisualize, progress, onMarkVisualized, onMarkSolved }: ProblemsProps) {
  const [search, setSearch] = useState('');
  const [patternFilter, setPatternFilter] = useState<Pattern | 'All'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || String(p.leetcodeId).includes(search);
      const matchesPattern = patternFilter === 'All' || p.pattern === patternFilter;
      const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      return matchesSearch && matchesPattern && matchesDifficulty;
    });
  }, [search, patternFilter, difficultyFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Problem Library</h1>
        <p className="text-slate-500 dark:text-slate-400">Curated binary search problems from LeetCode with FANG interview patterns</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or problem number..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={patternFilter}
              onChange={(e) => setPatternFilter(e.target.value as Pattern | 'All')}
              className="input-field pl-10 pr-8 text-sm cursor-pointer"
            >
              {patterns.map((p) => (
                <option key={p} value={p}>{p === 'All' ? 'All Patterns' : p}</option>
              ))}
            </select>
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'All')}
            className="input-field text-sm cursor-pointer"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Showing {filtered.length} of {problems.length} problems
      </div>

      {/* Problem grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            isSolved={progress.problemsSolved.includes(problem.id)}
            isVisualized={progress.problemsVisualized.includes(problem.id)}
            onVisualize={() => {
              onMarkVisualized(problem.id);
              onVisualize(problem.algorithmId);
            }}
            onSolve={() => onMarkSolved(problem.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">No problems match your filters.</p>
        </div>
      )}
    </div>
  );
}
