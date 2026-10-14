import React, { useState, useEffect } from 'react';
import { DSAProblem, UserProblemData, UserProblemStatus } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { TOPIC_INTUITIONS } from '../data/roadmapPhases';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  ExternalLink,
  Star,
  CheckCircle2,
  RotateCcw,
  Circle,
  BookOpen,
  Clock,
  HardDrive,
  Save,
} from 'lucide-react';

interface ProblemNotesDrawerProps {
  problem: DSAProblem | null;
  userData: UserProblemData;
  isOpen: boolean;
  onClose: () => void;
  onToggleSolved: (id: string) => void;
  onToggleRevision: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSaveNotes: (
    id: string,
    data: {
      notes?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
      status?: UserProblemStatus;
    }
  ) => void;
}

export const ProblemNotesDrawer: React.FC<ProblemNotesDrawerProps> = ({
  problem,
  userData,
  isOpen,
  onClose,
  onToggleSolved,
  onToggleRevision,
  onToggleFavorite,
  onSaveNotes,
}) => {
  const { isDark } = useTheme();

  const [notes, setNotes] = useState(userData?.notes || '');
  const [timeComplexity, setTimeComplexity] = useState(userData?.timeComplexity || '');
  const [spaceComplexity, setSpaceComplexity] = useState(userData?.spaceComplexity || '');
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (problem) {
      setNotes(userData?.notes || '');
      setTimeComplexity(userData?.timeComplexity || '');
      setSpaceComplexity(userData?.spaceComplexity || '');
      setHasSaved(false);
    }
  }, [problem, userData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !problem) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveNotes(problem.id, { notes, timeComplexity, spaceComplexity });
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 2000);
  };

  const topicTip = TOPIC_INTUITIONS[problem.topic];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div
          className={`w-screen max-w-lg border-l shadow-2xl flex flex-col transition-colors ${
            isDark
              ? 'bg-[#1f1f1f] border-[#2e2e2e] text-[#f1f1f1]'
              : 'bg-white border-[#e9e9e7] text-[#37352f]'
          }`}
        >
          {/* Header */}
          <div
            className={`p-5 border-b flex items-start justify-between gap-4 ${
              isDark ? 'border-[#2d2d2d] bg-[#1f1f1f]' : 'border-[#e9e9e7] bg-white'
            }`}
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div
                className={`flex items-center gap-2 text-xs ${
                  isDark ? 'text-[#888888]' : 'text-[#787774]'
                }`}
              >
                <span className="font-mono">#{problem.orderNum}</span>
                <span>/</span>
                {problem.leetcodeNum && (
                  <>
                    <span className="font-mono">LC #{problem.leetcodeNum}</span>
                    <span>/</span>
                  </>
                )}
                <span>{problem.topic}</span>
              </div>
              <h2
                className={`text-lg font-semibold tracking-tight leading-snug break-words ${
                  isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'
                }`}
              >
                {problem.title}
              </h2>
              <div className="pt-1 flex items-center gap-2">
                <DifficultyBadge difficulty={problem.difficulty} />
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-[4px] border ${
                    isDark
                      ? 'text-[#888888] bg-[#282828] border-[#333333]'
                      : 'text-[#787774] bg-[#f7f6f3] border-[#e9e9e7]'
                  }`}
                >
                  {problem.phaseTitle.split(':')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onToggleFavorite(problem.id)}
                className={`p-1.5 rounded-[4px] border transition-colors ${
                  userData.isFavorite
                    ? isDark
                      ? 'bg-[#d7a627]/20 text-[#d7a627] border-[#d7a627]/40'
                      : 'bg-[#fdecc8] text-[#a06800] border-[#f8dc9e]'
                    : isDark
                    ? 'bg-[#262626] text-[#888888] border-[#333333] hover:text-[#f1f1f1]'
                    : 'bg-[#f7f6f3] text-[#787774] border-[#e9e9e7] hover:text-[#37352f]'
                }`}
                title={userData.isFavorite ? 'Remove star' : 'Star problem'}
                aria-label="Star"
              >
                <Star size={15} className={userData.isFavorite ? 'fill-current' : ''} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-[4px] transition-colors ${
                  isDark
                    ? 'text-[#888888] hover:text-[#f1f1f1] hover:bg-[#282828]'
                    : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed]'
                }`}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Status Property Block */}
            <div
              className={`p-3 rounded-[6px] border space-y-2 ${
                isDark ? 'bg-[#242424] border-[#2e2e2e]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
              }`}
            >
              <div
                className={`text-[11px] font-normal uppercase tracking-wider ${
                  isDark ? 'text-[#888888]' : 'text-[#787774]'
                }`}
              >
                Status
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onSaveNotes(problem.id, { status: 'unsolved' })}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-[4px] text-xs font-normal border transition-colors ${
                    userData.status === 'unsolved'
                      ? isDark
                        ? 'bg-[#2e2e2e] text-[#f1f1f1] border-[#444444]'
                        : 'bg-white text-[#37352f] border-[#d3d1cb] shadow-2xs font-medium'
                      : isDark
                      ? 'bg-[#1c1c1c] text-[#888888] border-[#2a2a2a] hover:text-[#cccccc]'
                      : 'bg-[#f7f6f3] text-[#787774] border-transparent hover:bg-[#efefed]'
                  }`}
                >
                  <Circle size={12} />
                  <span>Todo</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSolved(problem.id)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-[4px] text-xs font-normal border transition-colors ${
                    userData.status === 'solved'
                      ? isDark
                        ? 'bg-[#448361]/25 text-[#64a37e] border-[#448361]/40'
                        : 'bg-[#dbeddb] text-[#1c3829] border-[#c0e0c0] shadow-2xs font-medium'
                      : isDark
                      ? 'bg-[#1c1c1c] text-[#888888] border-[#2a2a2a] hover:text-[#64a37e]'
                      : 'bg-[#f7f6f3] text-[#787774] border-transparent hover:bg-[#efefed]'
                  }`}
                >
                  <CheckCircle2 size={12} />
                  <span>Solved</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleRevision(problem.id)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-[4px] text-xs font-normal border transition-colors ${
                    userData.status === 'revision'
                      ? isDark
                        ? 'bg-[#d7a627]/25 text-[#d7a627] border-[#d7a627]/40'
                        : 'bg-[#fdecc8] text-[#402c1b] border-[#f8dc9e] shadow-2xs font-medium'
                      : isDark
                      ? 'bg-[#1c1c1c] text-[#888888] border-[#2a2a2a] hover:text-[#d7a627]'
                      : 'bg-[#f7f6f3] text-[#787774] border-transparent hover:bg-[#efefed]'
                  }`}
                >
                  <RotateCcw size={12} />
                  <span>Revisit</span>
                </button>
              </div>
            </div>

            {/* External URL Block */}
            <div
              className={`p-3 rounded-[6px] border flex items-center justify-between gap-3 ${
                isDark ? 'bg-[#242424] border-[#2e2e2e]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
              }`}
            >
              <div className="space-y-0.5 min-w-0">
                <div
                  className={`text-xs flex items-center gap-1.5 ${
                    isDark ? 'text-[#529cca]' : 'text-[#2383e2]'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>LeetCode URL</span>
                </div>
                <div
                  className={`text-[11px] truncate font-mono ${
                    isDark ? 'text-[#888888]' : 'text-[#787774]'
                  }`}
                >
                  {problem.link}
                </div>
              </div>
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border text-xs transition-colors shrink-0 ${
                  isDark
                    ? 'bg-[#2c2c2c] hover:bg-[#353535] border-[#383838] text-[#f1f1f1]'
                    : 'bg-white hover:bg-[#efefed] border-[#e3e2de] text-[#37352f]'
                }`}
              >
                <span>Open</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Pattern Intuition Callout */}
            {topicTip && (
              <div
                className={`p-3 rounded-[6px] border space-y-1 ${
                  isDark ? 'bg-[#242424] border-[#2e2e2e]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
                }`}
              >
                <div className={`text-xs ${isDark ? 'text-[#d0d0d0]' : 'text-[#37352f]'}`}>
                  💡 Pattern Intuition
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? 'text-[#888888]' : 'text-[#787774]'
                  }`}
                >
                  {topicTip}
                </p>
              </div>
            )}

            {/* Notes Form */}
            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label
                    className={`text-xs flex items-center gap-1 ${
                      isDark ? 'text-[#888888]' : 'text-[#787774]'
                    }`}
                  >
                    <Clock size={12} />
                    <span>Time</span>
                  </label>
                  <input
                    type="text"
                    value={timeComplexity}
                    onChange={(e) => setTimeComplexity(e.target.value)}
                    placeholder="e.g. O(N log N)"
                    className={`w-full px-2.5 py-1.5 rounded-[4px] border text-xs font-mono focus:outline-none ${
                      isDark
                        ? 'bg-[#191919] border-[#2e2e2e] text-[#f1f1f1] placeholder:text-[#555555] focus:border-[#444444]'
                        : 'bg-white border-[#e3e2de] text-[#37352f] placeholder:text-[#9b9a97] focus:border-[#c5c3bd]'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    className={`text-xs flex items-center gap-1 ${
                      isDark ? 'text-[#888888]' : 'text-[#787774]'
                    }`}
                  >
                    <HardDrive size={12} />
                    <span>Space</span>
                  </label>
                  <input
                    type="text"
                    value={spaceComplexity}
                    onChange={(e) => setSpaceComplexity(e.target.value)}
                    placeholder="e.g. O(1)"
                    className={`w-full px-2.5 py-1.5 rounded-[4px] border text-xs font-mono focus:outline-none ${
                      isDark
                        ? 'bg-[#191919] border-[#2e2e2e] text-[#f1f1f1] placeholder:text-[#555555] focus:border-[#444444]'
                        : 'bg-white border-[#e3e2de] text-[#37352f] placeholder:text-[#9b9a97] focus:border-[#c5c3bd]'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-xs ${isDark ? 'text-[#888888]' : 'text-[#787774]'}`}>
                  Personal Notes & Approach
                </label>
                <textarea
                  rows={7}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your pattern insight, edge cases, or implementation notes..."
                  className={`w-full p-2.5 rounded-[5px] border text-xs leading-relaxed focus:outline-none resize-none font-mono ${
                    isDark
                      ? 'bg-[#191919] border-[#2e2e2e] text-[#f1f1f1] placeholder:text-[#555555] focus:border-[#444444]'
                      : 'bg-white border-[#e3e2de] text-[#37352f] placeholder:text-[#9b9a97] focus:border-[#c5c3bd]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span
                  className={`text-xs ${isDark ? 'text-[#64a37e]' : 'text-[#2e7d32]'}`}
                >
                  {hasSaved ? '✓ Saved' : ''}
                </span>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-[4px] text-xs border transition-colors ${
                    isDark
                      ? 'bg-[#2a2a2a] hover:bg-[#333333] text-[#f1f1f1] border-[#353535]'
                      : 'bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border-[#e3e2de]'
                  }`}
                >
                  <Save size={12} />
                  <span>Save Notes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div
            className={`p-3 px-5 border-t flex items-center justify-between text-xs ${
              isDark
                ? 'border-[#2d2d2d] bg-[#1c1c1c] text-[#888888]'
                : 'border-[#e9e9e7] bg-[#fbfbfa] text-[#787774]'
            }`}
          >
            <span>
              {userData.solvedAt
                ? `Solved on ${new Date(userData.solvedAt).toLocaleDateString()}`
                : 'Not solved yet'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className={`px-2.5 py-1 rounded-[4px] transition-colors ${
                isDark ? 'hover:bg-[#282828] text-[#cccccc]' : 'hover:bg-[#efefed] text-[#37352f]'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
