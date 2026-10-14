import React, { useState, useMemo } from 'react';
import { RoadmapViewMode, DSAProblem } from './types';
import { allDSAProblems } from './data/dsaLoader';
import { useRoadmapStorage } from './lib/useRoadmapStorage';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { RoadmapNavbar } from './components/RoadmapNavbar';
import { RoadmapStatsHeader } from './components/RoadmapStatsHeader';
import { RoadmapGraphView } from './components/RoadmapGraphView';
import { TopicAccordionView } from './components/TopicAccordionView';
import { AllProblemsTableView } from './components/AllProblemsTableView';
import { ProblemNotesDrawer } from './components/ProblemNotesDrawer';
import { SearchModal } from './components/SearchModal';
import { RandomChallengeModal } from './components/RandomChallengeModal';
import { DataManagementModal } from './components/DataManagementModal';
import { Compass, FolderTree, Table } from 'lucide-react';

function RoadmapAppContent() {
  const { isDark } = useTheme();
  const {
    userState,
    getProblemData,
    toggleSolved,
    toggleRevision,
    toggleFavorite,
    saveProblemNotes,
    resetAllProgress,
    exportProgress,
    importProgress,
  } = useRoadmapStorage();

  const [viewMode, setViewMode] = useState<RoadmapViewMode>('roadmap');
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(null);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'solved' | 'revision' | 'starred'>('All');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRandomOpen, setIsRandomOpen] = useState(false);
  const [randomProblem, setRandomProblem] = useState<DSAProblem | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Pick random problem
  const handlePickRandom = () => {
    const unsolvedList = allDSAProblems.filter((p) => userState[p.id]?.status !== 'solved');
    const pool = unsolvedList.length > 0 ? unsolvedList : allDSAProblems;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setRandomProblem(pool[randomIndex]);
    setIsRandomOpen(true);
  };

  // Jump from Roadmap graph into a topic
  const handleSelectTopicFromGraph = (topic: string) => {
    setActiveTopicFilter(topic);
    setViewMode('topics');
  };

  const solvedCount = useMemo(() => {
    return Object.values(userState).filter((u) => u.status === 'solved').length;
  }, [userState]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isDark ? 'bg-[#191919] text-[#f1f1f1]' : 'bg-[#ffffff] text-[#37352f]'
      }`}
    >
      {/* 1. TOP NAVBAR */}
      <RoadmapNavbar
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          if (mode === 'roadmap') setActiveTopicFilter('All');
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onPickRandom={handlePickRandom}
        onExport={exportProgress}
        onImportClick={() => setIsDataModalOpen(true)}
        onReset={() => setIsDataModalOpen(true)}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">
        {/* Top KPI & Overview */}
        <RoadmapStatsHeader
          problems={allDSAProblems}
          userState={userState}
          onSelectProblem={(prob) => setSelectedProblem(prob)}
          onPickRandom={handlePickRandom}
          onFilterStatus={(s) => {
            setStatusFilter(s);
            if (s !== 'All' && viewMode === 'roadmap') {
              setViewMode('table');
            }
          }}
          currentStatusFilter={statusFilter}
        />

        {/* View Mode Subheader (Notion Database View Bar) */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t ${
            isDark ? 'border-[#2a2a2a]' : 'border-[#e9e9e7]'
          }`}
        >
          <div className="flex items-center gap-2">
            <h1
              className={`text-sm sm:text-base font-medium ${
                isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'
              }`}
            >
              {viewMode === 'roadmap' && 'Roadmap Progression'}
              {viewMode === 'topics' &&
                (activeTopicFilter !== 'All' ? `Topic: ${activeTopicFilter}` : '59 Topic Modules')}
              {viewMode === 'table' && 'All 600 Problems Database'}
            </h1>
            {activeTopicFilter !== 'All' && (
              <button
                type="button"
                onClick={() => setActiveTopicFilter('All')}
                className={`text-xs hover:underline ${
                  isDark ? 'text-[#529cca]' : 'text-[#2383e2]'
                }`}
              >
                (View All)
              </button>
            )}
          </div>

          <div
            className={`flex items-center gap-1 p-0.5 rounded-[5px] border self-start sm:self-auto ${
              isDark ? 'bg-[#202020] border-[#2d2d2d]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setViewMode('roadmap');
                setActiveTopicFilter('All');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-normal transition-colors ${
                viewMode === 'roadmap'
                  ? isDark
                    ? 'bg-[#2a2a2a] text-[#f1f1f1] font-medium'
                    : 'bg-white text-[#37352f] shadow-xs font-medium border border-[#e3e2de]'
                  : isDark
                  ? 'text-[#888888] hover:text-[#e0e0e0]'
                  : 'text-[#787774] hover:text-[#37352f]'
              }`}
            >
              <Compass size={12} />
              <span>Roadmap</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('topics')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-normal transition-colors ${
                viewMode === 'topics'
                  ? isDark
                    ? 'bg-[#2a2a2a] text-[#f1f1f1] font-medium'
                    : 'bg-white text-[#37352f] shadow-xs font-medium border border-[#e3e2de]'
                  : isDark
                  ? 'text-[#888888] hover:text-[#e0e0e0]'
                  : 'text-[#787774] hover:text-[#37352f]'
              }`}
            >
              <FolderTree size={12} />
              <span>Topics</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-normal transition-colors ${
                viewMode === 'table'
                  ? isDark
                    ? 'bg-[#2a2a2a] text-[#f1f1f1] font-medium'
                    : 'bg-white text-[#37352f] shadow-xs font-medium border border-[#e3e2de]'
                  : isDark
                  ? 'text-[#888888] hover:text-[#e0e0e0]'
                  : 'text-[#787774] hover:text-[#37352f]'
              }`}
            >
              <Table size={12} />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* 2. DYNAMIC ACTIVE VIEW */}
        {viewMode === 'roadmap' && (
          <RoadmapGraphView
            userState={userState}
            onSelectTopic={handleSelectTopicFromGraph}
            onSelectProblem={(prob) => setSelectedProblem(prob)}
          />
        )}

        {viewMode === 'topics' && (
          <TopicAccordionView
            userState={userState}
            onSelectProblem={(prob) => setSelectedProblem(prob)}
            onToggleSolved={toggleSolved}
            onToggleRevision={toggleRevision}
            onToggleFavorite={toggleFavorite}
            activeTopicFilter={activeTopicFilter}
          />
        )}

        {viewMode === 'table' && (
          <AllProblemsTableView
            problems={allDSAProblems}
            userState={userState}
            onSelectProblem={(prob) => setSelectedProblem(prob)}
            onToggleSolved={toggleSolved}
            onToggleRevision={toggleRevision}
            onToggleFavorite={toggleFavorite}
            initialTopic={activeTopicFilter}
          />
        )}
      </main>

      {/* 3. PROBLEM DETAILS & NOTES DRAWER */}
      <ProblemNotesDrawer
        problem={selectedProblem}
        userData={
          selectedProblem
            ? getProblemData(selectedProblem.id)
            : { status: 'unsolved', isFavorite: false }
        }
        isOpen={Boolean(selectedProblem)}
        onClose={() => setSelectedProblem(null)}
        onToggleSolved={toggleSolved}
        onToggleRevision={toggleRevision}
        onToggleFavorite={toggleFavorite}
        onSaveNotes={saveProblemNotes}
      />

      {/* 4. SEARCH SPOTLIGHT MODAL (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        problems={allDSAProblems}
        userState={userState}
        onSelectProblem={(prob) => setSelectedProblem(prob)}
      />

      {/* 5. RANDOM CHALLENGE MODAL */}
      <RandomChallengeModal
        problem={randomProblem}
        isOpen={isRandomOpen}
        onClose={() => setIsRandomOpen(false)}
        onPickAnother={handlePickRandom}
        onOpenDetails={(prob) => setSelectedProblem(prob)}
        userData={
          randomProblem
            ? getProblemData(randomProblem.id)
            : { status: 'unsolved', isFavorite: false }
        }
      />

      {/* 6. DATA MANAGEMENT MODAL */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onExport={exportProgress}
        onImport={importProgress}
        onReset={resetAllProgress}
        solvedCount={solvedCount}
      />

      {/* 7. FOOTER */}
      <footer
        className={`border-t py-5 text-center text-xs transition-colors ${
          isDark
            ? 'border-[#282828] bg-[#191919] text-[#777777]'
            : 'border-[#e9e9e7] bg-[#ffffff] text-[#787774]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className={isDark ? 'text-[#a0a0a0]' : 'text-[#37352f]'}>
              DSA Roadmap Vault
            </span>
            <span>·</span>
            <span>600 Curated Problems</span>
          </div>
          <div
            className={`flex items-center gap-3 text-[11px] ${
              isDark ? 'text-[#777777]' : 'text-[#9b9a97]'
            }`}
          >
            <span>
              Press{' '}
              <kbd
                className={`px-1.5 py-0.2 rounded border font-mono ${
                  isDark
                    ? 'bg-[#242424] border-[#333333] text-[#aaaaaa]'
                    : 'bg-[#f7f6f3] border-[#e3e2de] text-[#787774]'
                }`}
              >
                ⌘K
              </kbd>{' '}
              to search
            </span>
            <span>·</span>
            <span>Local Browser Storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RoadmapAppContent />
    </ThemeProvider>
  );
}
