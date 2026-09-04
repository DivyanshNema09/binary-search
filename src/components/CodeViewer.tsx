import { motion } from 'framer-motion';
import type { Language } from '@/types';

interface CodeViewerProps {
  code: string[];
  activeLine: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const languageLabels: Record<Language, string> = {
  c: 'C',
  cpp: 'C++',
  java: 'Java',
};

export function CodeViewer({ code, activeLine, language, onLanguageChange }: CodeViewerProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-surface-300 px-4 py-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Source Code</span>
        <div className="flex gap-1">
          {(['c', 'cpp', 'java'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                language === lang
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'bg-slate-100 dark:bg-surface-200 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-surface-300'
              }`}
            >
              {languageLabels[lang]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        <pre className="leading-relaxed">
          {code.map((line, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                backgroundColor: i === activeLine
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(0, 0, 0, 0)',
              }}
              className={`flex items-start gap-3 rounded px-2 py-0.5 transition-colors duration-200 ${
                i === activeLine
                  ? 'bg-primary-500/10 border-l-2 border-primary-500'
                  : 'border-l-2 border-transparent'
              }`}
            >
              <span className={`select-none w-6 text-right ${i === activeLine ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-slate-400 dark:text-slate-600'}`}>
                {i + 1}
              </span>
              <span className={`flex-1 ${i === activeLine ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
                {line || ' '}
              </span>
            </motion.div>
          ))}
        </pre>
      </div>
      {activeLine >= 0 && activeLine < code.length && (
        <div className="border-t border-slate-200 dark:border-surface-300 px-4 py-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Line <span className="font-bold text-primary-600 dark:text-primary-400">{activeLine + 1}</span> is currently executing
          </span>
        </div>
      )}
    </div>
  );
}
