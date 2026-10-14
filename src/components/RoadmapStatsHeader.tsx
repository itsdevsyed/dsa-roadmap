import React from 'react';
import { DSAProblem, UserProblemData } from '../types';
import {
  totalProblemsCount,
  easyCount,
  mediumCount,
  hardCount,
} from '../data/dsaLoader';
import { useTheme } from '../context/ThemeContext';
import { RotateCcw, Star, Shuffle, ArrowRight } from 'lucide-react';

interface RoadmapStatsHeaderProps {
  problems: DSAProblem[];
  userState: Record<string, UserProblemData>;
  onSelectProblem: (problem: DSAProblem) => void;
  onPickRandom: () => void;
  onFilterStatus: (status: 'All' | 'solved' | 'revision' | 'starred') => void;
  currentStatusFilter: string;
}

export const RoadmapStatsHeader: React.FC<RoadmapStatsHeaderProps> = ({
  problems,
  userState,
  onSelectProblem,
  onPickRandom,
  onFilterStatus,
  currentStatusFilter,
}) => {
  const { isDark } = useTheme();

  let solvedTotal = 0;
  let solvedEasy = 0;
  let solvedMed = 0;
  let solvedHard = 0;
  let revisionCount = 0;
  let starredCount = 0;

  problems.forEach((p) => {
    const data = userState[p.id];
    if (data?.status === 'solved') {
      solvedTotal++;
      if (p.difficulty === 'Easy') solvedEasy++;
      if (p.difficulty === 'Medium') solvedMed++;
      if (p.difficulty === 'Hard') solvedHard++;
    } else if (data?.status === 'revision') {
      revisionCount++;
    }
    if (data?.isFavorite) {
      starredCount++;
    }
  });

  const percentage = Math.round((solvedTotal / totalProblemsCount) * 100);
  const nextUnsolved = problems.find((p) => userState[p.id]?.status !== 'solved');

  const cardBg = isDark ? 'bg-[#202020] border-[#2d2d2d]' : 'bg-[#f7f6f3] border-[#e9e9e7]';
  const trackBg = isDark ? 'bg-[#2d2d2d]' : 'bg-[#e3e2de]';
  const textMuted = isDark ? 'text-[#888888]' : 'text-[#787774]';
  const textPrimary = isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]';
  const borderSubtle = isDark ? 'border-[#292929]' : 'border-[#e9e9e7]';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Overall Completion */}
      <div className={`p-3.5 rounded-[8px] border flex flex-col justify-between transition-colors ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${textMuted}`}>Progress</span>
          <span
            className={`text-xs font-mono px-1.5 py-0.5 rounded-[4px] border ${
              isDark
                ? 'text-[#64a37e] bg-[#448361]/20 border-[#448361]/30'
                : 'text-[#1c3829] bg-[#dbeddb] border-[#c0e0c0]'
            }`}
          >
            {percentage}%
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold font-mono ${textPrimary}`}>
              {solvedTotal}
            </span>
            <span className={`text-xs ${textMuted}`}>/ {totalProblemsCount} solved</span>
          </div>

          <div className={`w-full ${trackBg} rounded-[3px] h-1.5 mt-2 overflow-hidden`}>
            <div
              className={`h-1.5 rounded-[3px] transition-all duration-300 ${
                isDark ? 'bg-[#529cca]' : 'bg-[#2383e2]'
              }`}
              style={{ width: `${Math.max(percentage, 1)}%` }}
            />
          </div>
        </div>

        <div className={`text-[11px] ${textMuted} flex items-center justify-between pt-1.5 border-t ${borderSubtle}`}>
          <span>Curated Roadmap</span>
          <span className="font-mono">{totalProblemsCount - solvedTotal} remaining</span>
        </div>
      </div>

      {/* 2. Difficulty Distribution */}
      <div className={`p-3.5 rounded-[8px] border flex flex-col justify-between space-y-1.5 transition-colors ${cardBg}`}>
        <div className={`flex items-center justify-between text-xs ${textMuted}`}>
          <span>By Difficulty</span>
          <span className="text-[11px]">Ratio</span>
        </div>

        <div className="space-y-1.5 text-xs">
          {/* Easy */}
          <div>
            <div className="flex justify-between items-center mb-0.5 text-[11px]">
              <span className={isDark ? 'text-[#64a37e]' : 'text-[#1c3829]'}>Easy</span>
              <span className={`font-mono ${textMuted}`}>
                {solvedEasy} / {easyCount}
              </span>
            </div>
            <div className={`w-full ${trackBg} rounded-[2px] h-1 overflow-hidden`}>
              <div
                className={`h-1 rounded-[2px] ${isDark ? 'bg-[#64a37e]' : 'bg-[#448361]'}`}
                style={{ width: `${(solvedEasy / easyCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="flex justify-between items-center mb-0.5 text-[11px]">
              <span className={isDark ? 'text-[#d7a627]' : 'text-[#a06800]'}>Medium</span>
              <span className={`font-mono ${textMuted}`}>
                {solvedMed} / {mediumCount}
              </span>
            </div>
            <div className={`w-full ${trackBg} rounded-[2px] h-1 overflow-hidden`}>
              <div
                className={`h-1 rounded-[2px] ${isDark ? 'bg-[#d7a627]' : 'bg-[#cb9301]'}`}
                style={{ width: `${(solvedMed / mediumCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="flex justify-between items-center mb-0.5 text-[11px]">
              <span className={isDark ? 'text-[#e16b67]' : 'text-[#c73e3a]'}>Hard</span>
              <span className={`font-mono ${textMuted}`}>
                {solvedHard} / {hardCount}
              </span>
            </div>
            <div className={`w-full ${trackBg} rounded-[2px] h-1 overflow-hidden`}>
              <div
                className={`h-1 rounded-[2px] ${isDark ? 'bg-[#e16b67]' : 'bg-[#d44c47]'}`}
                style={{ width: `${(solvedHard / hardCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Review & Starred */}
      <div className={`p-3.5 rounded-[8px] border flex flex-col justify-between transition-colors ${cardBg}`}>
        <div className={`flex items-center justify-between text-xs ${textMuted}`}>
          <span>Tags & Flags</span>
          <span className="text-[11px]">Quick Filter</span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-1">
          <button
            type="button"
            onClick={() => onFilterStatus(currentStatusFilter === 'revision' ? 'All' : 'revision')}
            className={`p-2 rounded-[6px] border text-left transition-colors ${
              currentStatusFilter === 'revision'
                ? isDark
                  ? 'bg-[#d7a627]/18 border-[#d7a627]/40 text-[#d7a627]'
                  : 'bg-[#fdecc8] border-[#f8dc9e] text-[#402c1b]'
                : isDark
                ? 'bg-[#242424] border-[#2f2f2f] hover:bg-[#282828] text-[#cccccc]'
                : 'bg-white border-[#e3e2de] hover:bg-[#efefed] text-[#37352f]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <RotateCcw size={12} />
              <span>Revisit</span>
            </div>
            <div className={`text-lg font-bold font-mono mt-0.5 ${textPrimary}`}>
              {revisionCount}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onFilterStatus(currentStatusFilter === 'starred' ? 'All' : 'starred')}
            className={`p-2 rounded-[6px] border text-left transition-colors ${
              currentStatusFilter === 'starred'
                ? isDark
                  ? 'bg-[#d7a627]/18 border-[#d7a627]/40 text-[#d7a627]'
                  : 'bg-[#fdecc8] border-[#f8dc9e] text-[#402c1b]'
                : isDark
                ? 'bg-[#242424] border-[#2f2f2f] hover:bg-[#282828] text-[#cccccc]'
                : 'bg-white border-[#e3e2de] hover:bg-[#efefed] text-[#37352f]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <Star size={12} className={starredCount > 0 ? 'fill-current' : ''} />
              <span>Starred</span>
            </div>
            <div className={`text-lg font-bold font-mono mt-0.5 ${textPrimary}`}>
              {starredCount}
            </div>
          </button>
        </div>

        <div className={`text-[11px] ${textMuted} flex items-center justify-between pt-1.5 border-t ${borderSubtle}`}>
          <span>Active filter:</span>
          <span className={`capitalize ${textPrimary}`}>{currentStatusFilter}</span>
        </div>
      </div>

      {/* 4. Next Up / Study Session */}
      <div className={`p-3.5 rounded-[8px] border flex flex-col justify-between transition-colors ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${textMuted}`}>Next Up</span>
          <button
            type="button"
            onClick={onPickRandom}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[11px] transition-colors ${
              isDark
                ? 'text-[#888888] hover:text-[#cccccc] hover:bg-[#2a2a2a]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed]'
            }`}
            title="Random Challenge"
          >
            <Shuffle size={11} />
            <span>Random</span>
          </button>
        </div>

        {nextUnsolved ? (
          <div className="my-1">
            <button
              type="button"
              onClick={() => onSelectProblem(nextUnsolved)}
              className="text-left group block w-full"
            >
              <div className={`text-[11px] font-mono ${isDark ? 'text-[#529cca]' : 'text-[#2383e2]'}`}>
                #{nextUnsolved.orderNum} · {nextUnsolved.topic}
              </div>
              <div className={`text-xs font-medium ${textPrimary} group-hover:underline transition-colors truncate mt-0.5`}>
                {nextUnsolved.title}
              </div>
              <div className={`text-[11px] ${textMuted} mt-0.5`}>
                Difficulty: <span className={textPrimary}>{nextUnsolved.difficulty}</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="text-xs text-[#64a37e] py-2">
            ✓ All 600 problems solved!
          </div>
        )}

        {nextUnsolved && (
          <button
            type="button"
            onClick={() => onSelectProblem(nextUnsolved)}
            className={`w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[5px] border text-xs font-normal transition-colors ${
              isDark
                ? 'bg-[#282828] hover:bg-[#2f2f2f] border-[#353535] text-[#f1f1f1]'
                : 'bg-white hover:bg-[#efefed] border-[#e3e2de] text-[#37352f]'
            }`}
          >
            <span>Solve Next</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
