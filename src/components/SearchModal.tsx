import React, { useState, useEffect, useRef } from 'react';
import { DSAProblem, UserProblemData } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { useTheme } from '../context/ThemeContext';
import { Search, X, CheckCircle2, RotateCcw } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: DSAProblem[];
  userState: Record<string, UserProblemData>;
  onSelectProblem: (problem: DSAProblem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  problems,
  userState,
  onSelectProblem,
}) => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? problems
        .filter((p) => {
          const q = query.toLowerCase().trim();
          return (
            p.title.toLowerCase().includes(q) ||
            p.topic.toLowerCase().includes(q) ||
            String(p.orderNum) === q ||
            p.leetcodeNum === q
          );
        })
        .slice(0, 15)
    : problems.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-16">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative max-w-xl mx-auto border rounded-[8px] shadow-2xl overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#202020] border-[#2e2e2e] text-[#f1f1f1]'
            : 'bg-white border-[#e9e9e7] text-[#37352f]'
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`p-3.5 border-b flex items-center gap-2.5 ${
            isDark ? 'border-[#2a2a2a] bg-[#202020]' : 'border-[#e9e9e7] bg-white'
          }`}
        >
          <Search
            size={15}
            className={`shrink-0 ${isDark ? 'text-[#888888]' : 'text-[#9b9a97]'}`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems (e.g. '3Sum', 'Two Pointers', '238')..."
            className={`w-full bg-transparent border-0 text-xs sm:text-sm focus:outline-none ${
              isDark
                ? 'text-[#f1f1f1] placeholder:text-[#666666]'
                : 'text-[#37352f] placeholder:text-[#9b9a97]'
            }`}
          />
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-[4px] ${
              isDark ? 'text-[#888888] hover:text-[#f1f1f1]' : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        {/* Results List */}
        <div
          className={`max-h-96 overflow-y-auto p-1.5 divide-y ${
            isDark ? 'divide-[#262626]' : 'divide-[#f1f1ef]'
          }`}
        >
          <div
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider ${
              isDark ? 'text-[#777777]' : 'text-[#9b9a97]'
            }`}
          >
            {query.trim() ? `Search Matches (${results.length})` : 'Popular Roadmap Problems'}
          </div>

          {results.length === 0 ? (
            <div
              className={`py-8 text-center text-xs ${
                isDark ? 'text-[#666666]' : 'text-[#9b9a97]'
              }`}
            >
              No problems found matching "{query}".
            </div>
          ) : (
            results.map((problem) => {
              const status = userState[problem.id]?.status || 'unsolved';

              return (
                <button
                  key={problem.id}
                  type="button"
                  onClick={() => {
                    onSelectProblem(problem);
                    onClose();
                  }}
                  className={`w-full p-2 rounded-[5px] flex items-center justify-between gap-3 text-left transition-colors group ${
                    isDark ? 'hover:bg-[#272727]' : 'hover:bg-[#f7f6f3]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-xs font-mono w-7 shrink-0 ${
                        isDark ? 'text-[#666666]' : 'text-[#9b9a97]'
                      }`}
                    >
                      #{problem.orderNum}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-normal truncate transition-colors ${
                          isDark
                            ? 'text-[#f1f1f1] group-hover:text-[#529cca]'
                            : 'text-[#37352f] group-hover:text-[#2383e2]'
                        }`}
                      >
                        {problem.title}
                      </div>
                      <div
                        className={`flex items-center gap-1.5 text-[11px] ${
                          isDark ? 'text-[#888888]' : 'text-[#787774]'
                        }`}
                      >
                        <span>{problem.topic}</span>
                        {problem.leetcodeNum && (
                          <>
                            <span>/</span>
                            <span className="font-mono">LC #{problem.leetcodeNum}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                    {status === 'solved' && (
                      <CheckCircle2
                        size={14}
                        className={isDark ? 'text-[#64a37e]' : 'text-[#2e7d32]'}
                      />
                    )}
                    {status === 'revision' && (
                      <RotateCcw
                        size={14}
                        className={isDark ? 'text-[#d7a627]' : 'text-[#a06800]'}
                      />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-2.5 px-3 border-t flex items-center justify-between text-[11px] ${
            isDark
              ? 'bg-[#1a1a1a] border-[#2a2a2a] text-[#777777]'
              : 'bg-[#f7f6f3] border-[#e9e9e7] text-[#787774]'
          }`}
        >
          <span>Press Esc to close</span>
          <span>600 Curated Problems</span>
        </div>
      </div>
    </div>
  );
};
