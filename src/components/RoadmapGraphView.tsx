import React from 'react';
import { ROADMAP_PHASES, TOPIC_INTUITIONS } from '../data/roadmapPhases';
import { problemsByTopic } from '../data/dsaLoader';
import { DSAProblem, UserProblemData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Check, ArrowUpRight } from 'lucide-react';

interface RoadmapGraphViewProps {
  userState: Record<string, UserProblemData>;
  onSelectTopic: (topic: string) => void;
  onSelectProblem: (problem: DSAProblem) => void;
}

export const RoadmapGraphView: React.FC<RoadmapGraphViewProps> = ({
  userState,
  onSelectTopic,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      {/* Notion-style Page Callout Banner */}
      <div
        className={`p-4 rounded-[6px] border flex items-start gap-3 transition-colors ${
          isDark ? 'bg-[#202020] border-[#2d2d2d]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
        }`}
      >
        <div className="text-lg p-0.5">💡</div>
        <div className="space-y-1">
          <h2
            className={`text-sm font-medium ${
              isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'
            }`}
          >
            Curated 600 DSA Roadmap · 8 Milestone Phases
          </h2>
          <p
            className={`text-xs leading-relaxed ${
              isDark ? 'text-[#888888]' : 'text-[#787774]'
            }`}
          >
            Follow this sequential roadmap from linear structures and pointer sweeps to recursive backtracking, hierarchical trees, and multi-dimensional dynamic programming.
          </p>
        </div>
      </div>

      {/* Phases Progression List */}
      <div className="space-y-6">
        {ROADMAP_PHASES.map((phase) => {
          let totalPhaseProblems = 0;
          let solvedPhaseProblems = 0;

          phase.topics.forEach((topic) => {
            const list = problemsByTopic[topic] || [];
            totalPhaseProblems += list.length;
            list.forEach((p) => {
              if (userState[p.id]?.status === 'solved') {
                solvedPhaseProblems++;
              }
            });
          });

          const phasePercent =
            totalPhaseProblems > 0
              ? Math.round((solvedPhaseProblems / totalPhaseProblems) * 100)
              : 0;
          const isPhaseDone = phasePercent === 100 && totalPhaseProblems > 0;

          return (
            <div
              key={phase.id}
              className={`border rounded-[8px] p-4 sm:p-5 space-y-3.5 transition-colors ${
                isDark
                  ? 'bg-[#202020] border-[#2d2d2d]'
                  : 'bg-white border-[#e9e9e7] shadow-xs'
              }`}
            >
              {/* Phase Header */}
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b ${
                  isDark ? 'border-[#292929]' : 'border-[#f1f1ef]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-[4px] flex items-center justify-center font-mono text-xs border ${
                      isPhaseDone
                        ? isDark
                          ? 'bg-[#448361]/25 text-[#64a37e] border-[#448361]/40'
                          : 'bg-[#dbeddb] text-[#1c3829] border-[#c0e0c0]'
                        : isDark
                        ? 'bg-[#272727] text-[#9b9b9b] border-[#333333]'
                        : 'bg-[#f7f6f3] text-[#787774] border-[#e3e2de]'
                    }`}
                  >
                    {isPhaseDone ? <Check size={14} /> : phase.id}
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-medium ${
                        isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'
                      }`}
                    >
                      {phase.title}
                    </h3>
                    <p
                      className={`text-xs ${
                        isDark ? 'text-[#888888]' : 'text-[#787774]'
                      }`}
                    >
                      {phase.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  <span
                    className={`text-xs font-mono ${
                      isDark ? 'text-[#888888]' : 'text-[#787774]'
                    }`}
                  >
                    {solvedPhaseProblems}/{totalPhaseProblems} Solved
                  </span>
                  <span
                    className={`text-xs font-mono px-1.5 py-0.5 rounded-[3px] border ${
                      isDark
                        ? 'text-[#64a37e] bg-[#448361]/20 border-[#448361]/30'
                        : 'text-[#1c3829] bg-[#dbeddb] border-[#c0e0c0]'
                    }`}
                  >
                    {phasePercent}%
                  </span>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {phase.topics.map((topic) => {
                  const topicProblems = problemsByTopic[topic] || [];
                  const topicTotal = topicProblems.length;
                  let topicSolved = 0;
                  let easyCount = 0;
                  let medCount = 0;
                  let hardCount = 0;

                  topicProblems.forEach((p) => {
                    if (userState[p.id]?.status === 'solved') topicSolved++;
                    if (p.difficulty === 'Easy') easyCount++;
                    if (p.difficulty === 'Medium') medCount++;
                    if (p.difficulty === 'Hard') hardCount++;
                  });

                  const intuition = TOPIC_INTUITIONS[topic];

                  return (
                    <div
                      key={topic}
                      className={`group border rounded-[6px] p-3 flex flex-col justify-between transition-colors ${
                        isDark
                          ? 'bg-[#242424] hover:bg-[#282828] border-[#2e2e2e] hover:border-[#3a3a3a]'
                          : 'bg-[#fbfbfa] hover:bg-[#f7f6f3] border-[#e9e9e7] hover:border-[#dcdbd7]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectTopic(topic)}
                            className={`text-left font-medium text-xs sm:text-sm line-clamp-1 transition-colors ${
                              isDark
                                ? 'text-[#e0e0e0] group-hover:text-[#529cca]'
                                : 'text-[#37352f] group-hover:text-[#2383e2]'
                            }`}
                            title={topic}
                          >
                            {topic}
                          </button>
                          <span
                            className={`text-[11px] font-mono px-1.5 py-0.5 rounded-[3px] border shrink-0 ${
                              isDark
                                ? 'text-[#888888] bg-[#1c1c1c] border-[#2d2d2d]'
                                : 'text-[#787774] bg-white border-[#e3e2de]'
                            }`}
                          >
                            {topicSolved}/{topicTotal}
                          </span>
                        </div>

                        {/* Difficulty counts with authentic Notion tags */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          {easyCount > 0 && (
                            <span
                              className={`px-1 py-0.2 rounded-[3px] ${
                                isDark
                                  ? 'text-[#64a37e] bg-[#448361]/15'
                                  : 'text-[#1c3829] bg-[#dbeddb]'
                              }`}
                            >
                              {easyCount}E
                            </span>
                          )}
                          {medCount > 0 && (
                            <span
                              className={`px-1 py-0.2 rounded-[3px] ${
                                isDark
                                  ? 'text-[#d7a627] bg-[#d7a627]/15'
                                  : 'text-[#402c1b] bg-[#fdecc8]'
                              }`}
                            >
                              {medCount}M
                            </span>
                          )}
                          {hardCount > 0 && (
                            <span
                              className={`px-1 py-0.2 rounded-[3px] ${
                                isDark
                                  ? 'text-[#e16b67] bg-[#e16b67]/15'
                                  : 'text-[#5d1715] bg-[#ffe2dd]'
                              }`}
                            >
                              {hardCount}H
                            </span>
                          )}
                        </div>

                        {/* Intuition tip */}
                        {intuition && (
                          <p
                            className={`text-[11px] line-clamp-2 leading-relaxed pt-0.5 ${
                              isDark ? 'text-[#888888]' : 'text-[#787774]'
                            }`}
                          >
                            {intuition}
                          </p>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div
                        className={`pt-2.5 mt-2 border-t flex items-center justify-between ${
                          isDark ? 'border-[#2a2a2a]' : 'border-[#e9e9e7]'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-mono ${
                            isDark ? 'text-[#666666]' : 'text-[#9b9a97]'
                          }`}
                        >
                          {Math.round((topicSolved / topicTotal) * 100)}% done
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectTopic(topic)}
                          className={`inline-flex items-center gap-0.5 text-[11px] transition-colors ${
                            isDark
                              ? 'text-[#888888] group-hover:text-[#f1f1f1]'
                              : 'text-[#787774] group-hover:text-[#37352f]'
                          }`}
                        >
                          <span>Open</span>
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
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
