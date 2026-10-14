import React, { useState, useMemo } from 'react';
import { DSAProblem, UserProblemData, Difficulty } from '../types';
import { ROADMAP_PHASES } from '../data/roadmapPhases';
import { allTopicsList } from '../data/dsaLoader';
import { DifficultyBadge } from './DifficultyBadge';
import { useTheme } from '../context/ThemeContext';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Star,
  ExternalLink,
  Search,
  FileEdit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface AllProblemsTableViewProps {
  problems: DSAProblem[];
  userState: Record<string, UserProblemData>;
  onSelectProblem: (problem: DSAProblem) => void;
  onToggleSolved: (id: string) => void;
  onToggleRevision: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  initialTopic?: string;
}

const ITEMS_PER_PAGE = 50;

export const AllProblemsTableView: React.FC<AllProblemsTableViewProps> = ({
  problems,
  userState,
  onSelectProblem,
  onToggleSolved,
  onToggleRevision,
  onToggleFavorite,
  initialTopic = 'All',
}) => {
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedPhase, setSelectedPhase] = useState<number | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | Difficulty>('All');
  const [selectedStatus, setSelectedStatus] = useState<
    'All' | 'solved' | 'unsolved' | 'revision' | 'starred'
  >('All');
  const [sortBy, setSortBy] = useState<'order' | 'leetcode' | 'difficulty' | 'name'>('order');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Sort
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        const data = userState[p.id] || { status: 'unsolved', isFavorite: false };

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchNum = String(p.orderNum).includes(q);
          const matchLC = p.leetcodeNum.toLowerCase().includes(q);
          const matchTopic = p.topic.toLowerCase().includes(q);
          if (!matchTitle && !matchNum && !matchLC && !matchTopic) return false;
        }

        if (selectedTopic !== 'All' && p.topic !== selectedTopic) return false;
        if (selectedPhase !== 'All' && p.phaseId !== selectedPhase) return false;
        if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;

        if (selectedStatus === 'solved' && data.status !== 'solved') return false;
        if (selectedStatus === 'unsolved' && data.status !== 'unsolved') return false;
        if (selectedStatus === 'revision' && data.status !== 'revision') return false;
        if (selectedStatus === 'starred' && !data.isFavorite) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'order') return a.orderNum - b.orderNum;
        if (sortBy === 'leetcode') {
          const numA = parseInt(a.leetcodeNum, 10) || 999999;
          const numB = parseInt(b.leetcodeNum, 10) || 999999;
          return numA - numB;
        }
        if (sortBy === 'difficulty') {
          const rank = { Easy: 1, Medium: 2, Hard: 3 };
          return rank[a.difficulty] - rank[b.difficulty];
        }
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [
    problems,
    userState,
    searchQuery,
    selectedTopic,
    selectedPhase,
    selectedDifficulty,
    selectedStatus,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pagedProblems = filteredProblems.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All');
    setSelectedPhase('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSortBy('order');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-3.5">
      {/* Notion-style Filter & Search Row */}
      <div
        className={`border rounded-[6px] p-3 space-y-3 transition-colors ${
          isDark ? 'bg-[#202020] border-[#2d2d2d]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <div className="relative lg:col-span-2">
            <Search
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-[#777777]' : 'text-[#9b9a97]'
              }`}
              size={13}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search problem title, #, or LeetCode #..."
              className={`w-full pl-8 pr-3 py-1.5 border rounded-[5px] text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#191919] border-[#2e2e2e] text-[#f1f1f1] placeholder:text-[#666666] focus:border-[#444444]'
                  : 'bg-white border-[#e3e2de] text-[#37352f] placeholder:text-[#9b9a97] focus:border-[#c5c3bd]'
              }`}
            />
          </div>

          <div>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-2.5 py-1.5 border rounded-[5px] text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#191919] border-[#2e2e2e] text-[#d0d0d0] focus:border-[#444444]'
                  : 'bg-white border-[#e3e2de] text-[#37352f] focus:border-[#c5c3bd]'
              }`}
            >
              <option value="All">All Topics ({allTopicsList.length})</option>
              {allTopicsList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value as any);
                setCurrentPage(1);
              }}
              className={`w-full px-2.5 py-1.5 border rounded-[5px] text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#191919] border-[#2e2e2e] text-[#d0d0d0] focus:border-[#444444]'
                  : 'bg-white border-[#e3e2de] text-[#37352f] focus:border-[#c5c3bd]'
              }`}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className={`w-full px-2.5 py-1.5 border rounded-[5px] text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#191919] border-[#2e2e2e] text-[#d0d0d0] focus:border-[#444444]'
                  : 'bg-white border-[#e3e2de] text-[#37352f] focus:border-[#c5c3bd]'
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Todo</option>
              <option value="revision">Needs Revision</option>
              <option value="starred">Starred Favorites</option>
            </select>
          </div>
        </div>

        {/* Phase filters strip */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs ${
            isDark ? 'border-[#282828]' : 'border-[#e9e9e7]'
          }`}
        >
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className={`mr-1 text-[11px] ${
                isDark ? 'text-[#777777]' : 'text-[#787774]'
              }`}
            >
              Phase:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedPhase('All');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded-[4px] text-[11px] transition-colors ${
                selectedPhase === 'All'
                  ? isDark
                    ? 'bg-[#2a2a2a] text-[#f1f1f1] border border-[#383838]'
                    : 'bg-white text-[#37352f] border border-[#d3d1cb] shadow-2xs font-medium'
                  : isDark
                  ? 'text-[#888888] hover:text-[#cccccc]'
                  : 'text-[#787774] hover:text-[#37352f]'
              }`}
            >
              All
            </button>
            {ROADMAP_PHASES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPhase(p.id);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-[4px] text-[11px] transition-colors ${
                  selectedPhase === p.id
                    ? isDark
                      ? 'bg-[#2a2a2a] text-[#f1f1f1] border border-[#383838]'
                      : 'bg-white text-[#37352f] border border-[#d3d1cb] shadow-2xs font-medium'
                    : isDark
                    ? 'text-[#888888] hover:text-[#cccccc]'
                    : 'text-[#787774] hover:text-[#37352f]'
                }`}
              >
                P{p.id}: {p.shortTitle}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] ${isDark ? 'text-[#777777]' : 'text-[#787774]'}`}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-2 py-0.5 border rounded-[4px] text-xs focus:outline-none ${
                isDark
                  ? 'bg-[#191919] border-[#2e2e2e] text-[#cccccc]'
                  : 'bg-white border-[#e3e2de] text-[#37352f]'
              }`}
            >
              <option value="order"># (1-600)</option>
              <option value="leetcode">LeetCode #</option>
              <option value="difficulty">Difficulty</option>
              <option value="name">Name (A-Z)</option>
            </select>
            {(searchQuery ||
              selectedTopic !== 'All' ||
              selectedPhase !== 'All' ||
              selectedDifficulty !== 'All' ||
              selectedStatus !== 'All') && (
              <button
                type="button"
                onClick={resetFilters}
                className={`text-[11px] hover:underline ml-1 ${
                  isDark ? 'text-[#529cca]' : 'text-[#2383e2]'
                }`}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Indicator */}
      <div
        className={`flex items-center justify-between text-xs px-1 ${
          isDark ? 'text-[#888888]' : 'text-[#787774]'
        }`}
      >
        <div>
          Showing{' '}
          <span className={`font-mono font-medium ${isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'}`}>
            {filteredProblems.length}
          </span>{' '}
          problems
        </div>
        <div className="font-mono text-[11px]">
          Page {safePage} of {totalPages}
        </div>
      </div>

      {/* Notion Database Table */}
      <div
        className={`border rounded-[6px] overflow-hidden transition-colors ${
          isDark ? 'bg-[#202020] border-[#2d2d2d]' : 'bg-white border-[#e9e9e7] shadow-2xs'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b font-normal text-[11px] ${
                  isDark
                    ? 'border-[#2d2d2d] bg-[#1d1d1d] text-[#888888]'
                    : 'border-[#e9e9e7] bg-[#f7f6f3] text-[#787774]'
                }`}
              >
                <th className="py-2.5 px-3 w-10 text-center">Done</th>
                <th className="py-2.5 px-3 w-14">#</th>
                <th className="py-2.5 px-3 w-16">LC #</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Topic</th>
                <th className="py-2.5 px-3 w-24">Difficulty</th>
                <th className="py-2.5 px-3 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? 'divide-[#262626]' : 'divide-[#f1f1ef]'
              }`}
            >
              {pagedProblems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`text-center py-10 ${
                      isDark ? 'text-[#666666]' : 'text-[#9b9a97]'
                    }`}
                  >
                    No problems match your current criteria.
                  </td>
                </tr>
              ) : (
                pagedProblems.map((problem) => {
                  const data =
                    userState[problem.id] || { status: 'unsolved', isFavorite: false };
                  const isSolved = data.status === 'solved';
                  const isRevision = data.status === 'revision';
                  const isFav = data.isFavorite;

                  return (
                    <tr
                      key={problem.id}
                      className={`transition-colors ${
                        isDark
                          ? `hover:bg-[#252525] ${isSolved ? 'bg-[#1b1b1b]' : ''}`
                          : `hover:bg-[#fbfbfa] ${isSolved ? 'bg-[#f7f6f3]' : ''}`
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleSolved(problem.id)}
                          className={`p-0.5 rounded transition-colors ${
                            isSolved
                              ? isDark
                                ? 'text-[#64a37e]'
                                : 'text-[#2e7d32]'
                              : isDark
                              ? 'text-[#555555] hover:text-[#999999]'
                              : 'text-[#b4b2aa] hover:text-[#37352f]'
                          }`}
                          title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                        >
                          {isSolved ? (
                            <CheckCircle2
                              size={15}
                              className={isDark ? 'fill-[#448361]/25' : 'fill-[#dbeddb]'}
                            />
                          ) : (
                            <Circle size={15} />
                          )}
                        </button>
                      </td>

                      {/* Roadmap Number */}
                      <td
                        className={`py-2 px-3 font-mono ${
                          isDark ? 'text-[#777777]' : 'text-[#9b9a97]'
                        }`}
                      >
                        #{problem.orderNum}
                      </td>

                      {/* LeetCode Number */}
                      <td
                        className={`py-2 px-3 font-mono ${
                          isDark ? 'text-[#777777]' : 'text-[#9b9a97]'
                        }`}
                      >
                        {problem.leetcodeNum ? problem.leetcodeNum : '—'}
                      </td>

                      {/* Problem Title */}
                      <td className="py-2 px-3">
                        <button
                          type="button"
                          onClick={() => onSelectProblem(problem)}
                          className={`text-left font-normal transition-colors ${
                            isDark
                              ? `hover:text-[#529cca] ${isSolved ? 'line-through text-[#666666]' : 'text-[#f1f1f1]'}`
                              : `hover:text-[#2383e2] ${isSolved ? 'line-through text-[#9b9a97]' : 'text-[#37352f]'}`
                          }`}
                        >
                          {problem.title}
                        </button>
                      </td>

                      {/* Topic (Notion Tag Property) */}
                      <td className="py-2 px-3">
                        <span
                          className={`text-[11px] px-1.5 py-0.5 rounded-[3px] border ${
                            isDark
                              ? 'text-[#9b9b9b] bg-[#282828] border-[#333333]'
                              : 'text-[#32302c] bg-[#e3e2e0] border-[#d5d4d2]'
                          }`}
                        >
                          {problem.topic}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-2 px-3">
                        <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onToggleRevision(problem.id)}
                            className={`p-1 rounded-[3px] transition-colors ${
                              isRevision
                                ? isDark
                                  ? 'text-[#d7a627] bg-[#d7a627]/20 border border-[#d7a627]/35'
                                  : 'text-[#a06800] bg-[#fdecc8] border border-[#f8dc9e]'
                                : isDark
                                ? 'text-[#666666] hover:text-[#aaaaaa]'
                                : 'text-[#787774] hover:text-[#37352f]'
                            }`}
                            title="Mark for Revision"
                          >
                            <RotateCcw size={12} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleFavorite(problem.id)}
                            className={`p-1 rounded-[3px] transition-colors ${
                              isFav
                                ? isDark
                                  ? 'text-[#d7a627] bg-[#d7a627]/20 border border-[#d7a627]/35'
                                  : 'text-[#a06800] bg-[#fdecc8] border border-[#f8dc9e]'
                                : isDark
                                ? 'text-[#666666] hover:text-[#aaaaaa]'
                                : 'text-[#787774] hover:text-[#37352f]'
                            }`}
                            title="Star Favorite"
                          >
                            <Star size={12} className={isFav ? 'fill-current' : ''} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectProblem(problem)}
                            className={`p-1 rounded-[3px] transition-colors ${
                              data.notes
                                ? isDark
                                  ? 'text-[#529cca] bg-[#529cca]/20 border border-[#529cca]/35'
                                  : 'text-[#2383e2] bg-[#d3e5ef] border border-[#b6d5e7]'
                                : isDark
                                ? 'text-[#666666] hover:text-[#aaaaaa]'
                                : 'text-[#787774] hover:text-[#37352f]'
                            }`}
                            title="Open Notes"
                          >
                            <FileEdit size={12} />
                          </button>

                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1 rounded-[3px] transition-colors ${
                              isDark
                                ? 'text-[#666666] hover:text-[#f1f1f1]'
                                : 'text-[#787774] hover:text-[#37352f]'
                            }`}
                            title="Open LeetCode"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        {totalPages > 1 && (
          <div
            className={`p-2.5 border-t flex items-center justify-between gap-3 text-xs ${
              isDark
                ? 'bg-[#1d1d1d] border-[#2d2d2d] text-[#888888]'
                : 'bg-[#f7f6f3] border-[#e9e9e7] text-[#787774]'
            }`}
          >
            <span className="text-[11px]">
              Showing {(safePage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(safePage * ITEMS_PER_PAGE, filteredProblems.length)} of {filteredProblems.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={safePage === 1}
                className="p-1 rounded hover:opacity-80 disabled:opacity-30 disabled:pointer-events-none"
                title="First Page"
              >
                <ChevronsLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1 rounded hover:opacity-80 disabled:opacity-30 disabled:pointer-events-none"
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>

              <span
                className={`px-2 font-mono text-[11px] ${
                  isDark ? 'text-[#cccccc]' : 'text-[#37352f]'
                }`}
              >
                {safePage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1 rounded hover:opacity-80 disabled:opacity-30 disabled:pointer-events-none"
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage === totalPages}
                className="p-1 rounded hover:opacity-80 disabled:opacity-30 disabled:pointer-events-none"
                title="Last Page"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
