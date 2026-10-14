import React from 'react';
import { DSAProblem, UserProblemData } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { useTheme } from '../context/ThemeContext';
import { Shuffle, ExternalLink, X, BookOpen, ArrowRight } from 'lucide-react';

interface RandomChallengeModalProps {
  problem: DSAProblem | null;
  isOpen: boolean;
  onClose: () => void;
  onPickAnother: () => void;
  onOpenDetails: (problem: DSAProblem) => void;
  userData: UserProblemData;
}

export const RandomChallengeModal: React.FC<RandomChallengeModalProps> = ({
  problem,
  isOpen,
  onClose,
  onPickAnother,
  onOpenDetails,
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative max-w-md w-full border rounded-[8px] shadow-2xl p-5 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#202020] border-[#2e2e2e] text-[#f1f1f1]'
            : 'bg-white border-[#e9e9e7] text-[#37352f]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border text-xs font-normal ${
              isDark
                ? 'bg-[#272727] text-[#9b9b9b] border-[#333333]'
                : 'bg-[#f7f6f3] text-[#787774] border-[#e9e9e7]'
            }`}
          >
            <Shuffle size={12} />
            <span>Random Problem</span>
          </div>
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

        <div className="space-y-1">
          <div
            className={`text-xs font-mono ${isDark ? 'text-[#777777]' : 'text-[#9b9a97]'}`}
          >
            #{problem.orderNum} {problem.leetcodeNum && `· LC #${problem.leetcodeNum}`}
          </div>
          <h3
            className={`text-base font-semibold tracking-tight leading-snug ${
              isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'
            }`}
          >
            {problem.title}
          </h3>
          <div className="flex items-center gap-2 pt-1">
            <DifficultyBadge difficulty={problem.difficulty} />
            <span
              className={`text-xs px-2 py-0.5 rounded-[4px] border ${
                isDark
                  ? 'text-[#888888] bg-[#262626] border-[#303030]'
                  : 'text-[#787774] bg-[#f7f6f3] border-[#e9e9e7]'
              }`}
            >
              {problem.topic}
            </span>
          </div>
        </div>

        <p
          className={`text-xs leading-relaxed ${
            isDark ? 'text-[#888888]' : 'text-[#787774]'
          }`}
        >
          Solve this problem under real interview conditions without referencing solutions or discussion threads first.
        </p>

        <div className="space-y-2 pt-1">
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-[5px] border text-xs font-normal transition-colors ${
              isDark
                ? 'bg-[#2c2c2c] hover:bg-[#353535] border-[#383838] text-[#f1f1f1]'
                : 'bg-[#f7f6f3] hover:bg-[#efefed] border-[#e3e2de] text-[#37352f]'
            }`}
          >
            <BookOpen size={13} />
            <span>Open on LeetCode</span>
            <ExternalLink size={12} />
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onPickAnother}
              className={`w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[5px] text-xs border transition-colors ${
                isDark
                  ? 'bg-[#222222] hover:bg-[#282828] text-[#cccccc] border-[#303030]'
                  : 'bg-white hover:bg-[#efefed] text-[#37352f] border-[#e3e2de]'
              }`}
            >
              <Shuffle size={12} />
              <span>Roll Another</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenDetails(problem);
                onClose();
              }}
              className={`w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[5px] text-xs border transition-colors ${
                isDark
                  ? 'bg-[#222222] hover:bg-[#282828] text-[#cccccc] border-[#303030]'
                  : 'bg-white hover:bg-[#efefed] text-[#37352f] border-[#e3e2de]'
              }`}
            >
              <span>Take Notes</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
