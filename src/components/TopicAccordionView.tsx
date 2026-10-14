import React, { useState } from 'react';
import { ROADMAP_PHASES, TOPIC_INTUITIONS } from '../data/roadmapPhases';
import { problemsByTopic } from '../data/dsaLoader';
import { DSAProblem, UserProblemData } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { useTheme } from '../context/ThemeContext';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  RotateCcw,
  Star,
  ExternalLink,
  FileEdit,
} from 'lucide-react';

interface TopicAccordionViewProps {
  userState: Record<string, UserProblemData>;
  onSelectProblem: (problem: DSAProblem) => void;
  onToggleSolved: (id: string) => void;
  onToggleRevision: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  activeTopicFilter?: string;
}

export const TopicAccordionView: React.FC<TopicAccordionViewProps> = ({
  userState,
  onSelectProblem,
  onToggleSolved,
  onToggleRevision,
  onToggleFavorite,
  activeTopicFilter,
}) => {
  const { isDark } = useTheme();

  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (activeTopicFilter && activeTopicFilter !== 'All') {
      initial[activeTopicFilter] = true;
    } else {
      initial['Arrays'] = true;
      initial['Strings'] = true;
      initial['Two Pointers'] = true;
    }
    return initial;
  });

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    Object.keys(problemsByTopic).forEach((t) => (all[t] = true));
    setExpandedTopics(all);
  };

  const collapseAll = () => {
    setExpandedTopics({});
  };

  return (
    <div className="space-y-6">
      {/* Notion-style Toolbar */}
      <div
        className={`flex items-center justify-between pb-2 border-b text-xs ${
          isDark ? 'border-[#2d2d2d] text-[#888888]' : 'border-[#e9e9e7] text-[#787774]'
        }`}
      >
        <span>59 algorithmic modules · Organized by progression</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className={`px-2 py-0.5 rounded-[4px] text-xs transition-colors ${
              isDark
                ? 'text-[#888888] hover:text-[#f1f1f1] hover:bg-[#252525]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed]'
            }`}
          >
            Expand All
          </button>
          <span className={isDark ? 'text-[#444444]' : 'text-[#d3d1cb]'}>/</span>
          <button
            type="button"
            onClick={collapseAll}
            className={`px-2 py-0.5 rounded-[4px] text-xs transition-colors ${
              isDark
                ? 'text-[#888888] hover:text-[#f1f1f1] hover:bg-[#252525]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed]'
            }`}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Grouped by Phase */}
      <div className="space-y-6">
        {ROADMAP_PHASES.map((phase) => {
          const phaseTopics = phase.topics.filter((topic) => {
            if (!activeTopicFilter || activeTopicFilter === 'All') return true;
            return topic === activeTopicFilter;
          });

          if (phaseTopics.length === 0) return null;

          return (
            <div key={phase.id} className="space-y-2.5">
              {/* Phase Title */}
              <div className="flex items-center gap-2 px-1">
                <span
                  className={`text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-[#888888]' : 'text-[#787774]'
                  }`}
                >
                  {phase.title}
                </span>
              </div>

              {/* Topics list */}
              <div className="space-y-2">
                {phaseTopics.map((topic) => {
                  const problems = problemsByTopic[topic] || [];
                  const isExpanded = Boolean(expandedTopics[topic]);

                  let solvedCount = 0;
                  problems.forEach((p) => {
                    if (userState[p.id]?.status === 'solved') solvedCount++;
                  });

                  const percent =
                    problems.length > 0
                      ? Math.round((solvedCount / problems.length) * 100)
                      : 0;
                  const intuition = TOPIC_INTUITIONS[topic];

                  return (
                    <div
                      key={topic}
                      className={`border rounded-[6px] overflow-hidden transition-colors ${
                        isDark
                          ? 'bg-[#202020] border-[#2d2d2d]'
                          : 'bg-white border-[#e9e9e7] shadow-2xs'
                      }`}
                    >
                      {/* Topic Header Accordion Trigger */}
                      <button
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`w-full p-3 sm:px-4 flex items-center justify-between text-left transition-colors gap-3 ${
                          isDark ? 'hover:bg-[#252525]' : 'hover:bg-[#f7f6f3]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={isDark ? 'text-[#888888]' : 'text-[#787774]'}>
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-medium text-xs sm:text-sm ${
                                  isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'
                                }`}
                              >
                                {topic}
                              </span>
                              <span
                                className={`text-xs font-mono ${
                                  isDark ? 'text-[#888888]' : 'text-[#787774]'
                                }`}
                              >
                                ({solvedCount}/{problems.length})
                              </span>
                              {percent === 100 && (
                                <span
                                  className={`text-[10px] px-1.5 py-0.2 rounded-[3px] border ${
                                    isDark
                                      ? 'text-[#64a37e] bg-[#448361]/20 border-[#448361]/35'
                                      : 'text-[#1c3829] bg-[#dbeddb] border-[#c0e0c0]'
                                  }`}
                                >
                                  Done
                                </span>
                              )}
                            </div>
                            {intuition && (
                              <p
                                className={`text-[11px] line-clamp-1 mt-0.5 ${
                                  isDark ? 'text-[#888888]' : 'text-[#787774]'
                                }`}
                              >
                                {intuition}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span
                            className={`text-[11px] font-mono hidden sm:inline-block ${
                              isDark ? 'text-[#888888]' : 'text-[#787774]'
                            }`}
                          >
                            {percent}%
                          </span>
                          <div
                            className={`w-16 rounded-[2px] h-1 overflow-hidden hidden sm:block ${
                              isDark ? 'bg-[#2d2d2d]' : 'bg-[#e3e2de]'
                            }`}
                          >
                            <div
                              className={`h-1 rounded-[2px] ${
                                isDark ? 'bg-[#529cca]' : 'bg-[#2383e2]'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Problems in this topic */}
                      {isExpanded && (
                        <div
                          className={`border-t divide-y ${
                            isDark
                              ? 'border-[#2a2a2a] bg-[#1c1c1c] divide-[#262626]'
                              : 'border-[#f1f1ef] bg-[#fbfbfa] divide-[#f1f1ef]'
                          }`}
                        >
                          {problems.map((problem) => {
                            const data =
                              userState[problem.id] || { status: 'unsolved', isFavorite: false };
                            const isSolved = data.status === 'solved';
                            const isRevision = data.status === 'revision';
                            const isFav = data.isFavorite;

                            return (
                              <div
                                key={problem.id}
                                className={`px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                                  isDark ? 'hover:bg-[#222222]' : 'hover:bg-[#f1f1ef]'
                                } ${isSolved ? 'opacity-80' : ''}`}
                              >
                                {/* Left: Status & Title */}
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <button
                                    type="button"
                                    onClick={() => onToggleSolved(problem.id)}
                                    className={`p-0.5 rounded transition-colors ${
                                      isSolved
                                        ? isDark
                                          ? 'text-[#64a37e]'
                                          : 'text-[#2e7d32]'
                                        : isDark
                                        ? 'text-[#666666] hover:text-[#aaaaaa]'
                                        : 'text-[#b4b2aa] hover:text-[#37352f]'
                                    }`}
                                    title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                                    aria-label="Toggle Solved"
                                  >
                                    {isSolved ? (
                                      <CheckCircle2
                                        size={16}
                                        className={isDark ? 'fill-[#448361]/25' : 'fill-[#dbeddb]'}
                                      />
                                    ) : (
                                      <Circle size={16} />
                                    )}
                                  </button>

                                  <span
                                    className={`text-xs font-mono w-7 shrink-0 ${
                                      isDark ? 'text-[#666666]' : 'text-[#9b9a97]'
                                    }`}
                                  >
                                    #{problem.orderNum}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => onSelectProblem(problem)}
                                    className={`text-left text-xs sm:text-sm truncate transition-colors ${
                                      isDark
                                        ? 'text-[#e0e0e0] hover:text-[#529cca]'
                                        : 'text-[#37352f] hover:text-[#2383e2]'
                                    }`}
                                  >
                                    <span
                                      className={
                                        isSolved
                                          ? isDark
                                            ? 'line-through text-[#777777]'
                                            : 'line-through text-[#9b9a97]'
                                          : ''
                                      }
                                    >
                                      {problem.title}
                                    </span>
                                  </button>

                                  {problem.leetcodeNum && (
                                    <span
                                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[3px] border hidden sm:inline-block shrink-0 ${
                                        isDark
                                          ? 'text-[#888888] bg-[#242424] border-[#303030]'
                                          : 'text-[#787774] bg-white border-[#e3e2de]'
                                      }`}
                                    >
                                      LC #{problem.leetcodeNum}
                                    </span>
                                  )}
                                </div>

                                {/* Right: Difficulty tag & actions */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <DifficultyBadge difficulty={problem.difficulty} size="sm" />

                                  <button
                                    type="button"
                                    onClick={() => onToggleRevision(problem.id)}
                                    className={`p-1.5 rounded-[4px] transition-colors ${
                                      isRevision
                                        ? isDark
                                          ? 'text-[#d7a627] bg-[#d7a627]/20 border border-[#d7a627]/35'
                                          : 'text-[#a06800] bg-[#fdecc8] border border-[#f8dc9e]'
                                        : isDark
                                        ? 'text-[#666666] hover:text-[#aaaaaa]'
                                        : 'text-[#787774] hover:text-[#37352f]'
                                    }`}
                                    title={isRevision ? 'Remove revision' : 'Mark for revision'}
                                    aria-label="Revision"
                                  >
                                    <RotateCcw size={13} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => onToggleFavorite(problem.id)}
                                    className={`p-1.5 rounded-[4px] transition-colors ${
                                      isFav
                                        ? isDark
                                          ? 'text-[#d7a627] bg-[#d7a627]/20 border border-[#d7a627]/35'
                                          : 'text-[#a06800] bg-[#fdecc8] border border-[#f8dc9e]'
                                        : isDark
                                        ? 'text-[#666666] hover:text-[#aaaaaa]'
                                        : 'text-[#787774] hover:text-[#37352f]'
                                    }`}
                                    title={isFav ? 'Remove star' : 'Star problem'}
                                    aria-label="Star"
                                  >
                                    <Star size={13} className={isFav ? 'fill-current' : ''} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => onSelectProblem(problem)}
                                    className={`p-1.5 rounded-[4px] transition-colors ${
                                      data.notes
                                        ? isDark
                                          ? 'text-[#529cca] bg-[#529cca]/20 border border-[#529cca]/35'
                                          : 'text-[#2383e2] bg-[#d3e5ef] border border-[#b6d5e7]'
                                        : isDark
                                        ? 'text-[#666666] hover:text-[#aaaaaa]'
                                        : 'text-[#787774] hover:text-[#37352f]'
                                    }`}
                                    title="Open Notes"
                                    aria-label="Notes"
                                  >
                                    <FileEdit size={13} />
                                  </button>

                                  <a
                                    href={problem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-1.5 rounded-[4px] transition-colors ${
                                      isDark
                                        ? 'text-[#666666] hover:text-[#f1f1f1]'
                                        : 'text-[#787774] hover:text-[#37352f]'
                                    }`}
                                    title="Open in LeetCode"
                                    aria-label="Open in LeetCode"
                                  >
                                    <ExternalLink size={13} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
