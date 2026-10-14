import React, { useEffect } from 'react';
import { RoadmapViewMode } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Compass,
  FolderTree,
  Table,
  Search,
  Shuffle,
  Download,
  Upload,
  BookMarked,
  Sun,
  Moon,
} from 'lucide-react';

interface RoadmapNavbarProps {
  viewMode: RoadmapViewMode;
  onViewModeChange: (mode: RoadmapViewMode) => void;
  onOpenSearch: () => void;
  onPickRandom: () => void;
  onExport: () => void;
  onImportClick: () => void;
  onReset: () => void;
}

export const RoadmapNavbar: React.FC<RoadmapNavbarProps> = ({
  viewMode,
  onViewModeChange,
  onOpenSearch,
  onPickRandom,
  onExport,
  onImportClick,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-sm border-b transition-colors ${
        isDark
          ? 'bg-[#191919]/95 border-[#2d2d2d] text-[#f1f1f1]'
          : 'bg-white/95 border-[#e9e9e7] text-[#37352f]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Left: Notion Page Header */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-[5px] border flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-[#242424] border-[#333333] text-[#9b9b9b]'
                : 'bg-[#f7f6f3] border-[#e3e2de] text-[#555555]'
            }`}
          >
            <BookMarked size={15} />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-medium text-sm tracking-tight ${
                isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'
              }`}
            >
              DSA Roadmap Vault
            </span>
            <span
              className={`text-xs hidden sm:inline ${
                isDark ? 'text-[#6e6e6e]' : 'text-[#9b9a97]'
              }`}
            >
              /
            </span>
            <span
              className={`text-xs font-mono px-1.5 py-0.5 rounded-[4px] border hidden sm:inline ${
                isDark
                  ? 'text-[#9b9b9b] bg-[#242424] border-[#333333]'
                  : 'text-[#787774] bg-[#f7f6f3] border-[#e9e9e7]'
              }`}
            >
              600 Problems
            </span>
          </div>
        </div>

        {/* Center: Notion-style Tab Switcher */}
        <div
          className={`hidden md:flex items-center gap-1 p-0.5 border rounded-[6px] ${
            isDark ? 'bg-[#202020] border-[#2d2d2d]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
          }`}
        >
          <button
            type="button"
            onClick={() => onViewModeChange('roadmap')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-xs font-normal transition-colors ${
              viewMode === 'roadmap'
                ? isDark
                  ? 'bg-[#2a2a2a] text-[#f1f1f1] font-medium shadow-2xs'
                  : 'bg-white text-[#37352f] font-medium shadow-xs border border-[#e3e2de]'
                : isDark
                ? 'text-[#9b9b9b] hover:text-[#e0e0e0] hover:bg-[#252525]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed]'
            }`}
          >
            <Compass size={13} />
            <span>Roadmap</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('topics')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-xs font-normal transition-colors ${
              viewMode === 'topics'
                ? isDark
                  ? 'bg-[#2a2a2a] text-[#f1f1f1] font-medium shadow-2xs'
                  : 'bg-white text-[#37352f] font-medium shadow-xs border border-[#e3e2de]'
                : isDark
                ? 'text-[#9b9b9b] hover:text-[#e0e0e0] hover:bg-[#252525]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed]'
            }`}
          >
            <FolderTree size={13} />
            <span>Topics (59)</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-xs font-normal transition-colors ${
              viewMode === 'table'
                ? isDark
                  ? 'bg-[#2a2a2a] text-[#f1f1f1] font-medium shadow-2xs'
                  : 'bg-white text-[#37352f] font-medium shadow-xs border border-[#e3e2de]'
                : isDark
                ? 'text-[#9b9b9b] hover:text-[#e0e0e0] hover:bg-[#252525]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed]'
            }`}
          >
            <Table size={13} />
            <span>Database Table</span>
          </button>
        </div>

        {/* Right: Quick Search, White/Black Theme Button & Actions */}
        <div className="flex items-center gap-1.5">
          {/* Quick Search */}
          <button
            type="button"
            onClick={onOpenSearch}
            className={`hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-[5px] border text-xs transition-colors ${
              isDark
                ? 'bg-[#222222] border-[#303030] text-[#888888] hover:text-[#cccccc]'
                : 'bg-[#f7f6f3] border-[#e9e9e7] text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Search size={12} />
            <span>Search...</span>
            <kbd
              className={`px-1.5 py-0.2 rounded border text-[10px] font-mono ${
                isDark
                  ? 'bg-[#1c1c1c] border-[#333333] text-[#888888]'
                  : 'bg-white border-[#e3e2de] text-[#787774]'
              }`}
            >
              ⌘K
            </kbd>
          </button>

          {/* NOTION WHITE / BLACK THEME BUTTON */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] border text-xs font-medium transition-colors shadow-2xs ${
              isDark
                ? 'bg-[#252525] hover:bg-[#2e2e2e] border-[#3a3a3a] text-[#f1f1f1]'
                : 'bg-[#f7f6f3] hover:bg-[#efefed] border-[#e3e2de] text-[#37352f]'
            }`}
            title={`Switch to Notion ${isDark ? 'White (Light)' : 'Black (Dark)'} Theme`}
            aria-label="Toggle Notion Theme"
          >
            {isDark ? (
              <>
                <Sun size={13} className="text-[#d7a627]" />
                <span className="hidden sm:inline">White Theme</span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-[#37352f]" />
                <span className="hidden sm:inline">Black Theme</span>
              </>
            )}
          </button>

          {/* Random Challenge */}
          <button
            type="button"
            onClick={onPickRandom}
            className={`p-1.5 rounded-[5px] border transition-colors ${
              isDark
                ? 'text-[#9b9b9b] hover:text-[#f1f1f1] hover:bg-[#252525] border-transparent hover:border-[#303030]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] border-transparent hover:border-[#e3e2de]'
            }`}
            title="Random Challenge"
            aria-label="Random Challenge"
          >
            <Shuffle size={14} />
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={onExport}
            className={`p-1.5 rounded-[5px] border transition-colors ${
              isDark
                ? 'text-[#9b9b9b] hover:text-[#f1f1f1] hover:bg-[#252525] border-transparent hover:border-[#303030]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] border-transparent hover:border-[#e3e2de]'
            }`}
            title="Export JSON"
            aria-label="Export JSON"
          >
            <Download size={14} />
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={onImportClick}
            className={`p-1.5 rounded-[5px] border transition-colors ${
              isDark
                ? 'text-[#9b9b9b] hover:text-[#f1f1f1] hover:bg-[#252525] border-transparent hover:border-[#303030]'
                : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] border-transparent hover:border-[#e3e2de]'
            }`}
            title="Import Data"
            aria-label="Import Data"
          >
            <Upload size={14} />
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div
        className={`flex md:hidden border-t px-3 py-1.5 gap-1 ${
          isDark ? 'bg-[#1c1c1c] border-[#2a2a2a]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
        }`}
      >
        <button
          type="button"
          onClick={() => onViewModeChange('roadmap')}
          className={`flex-1 py-1 text-xs text-center rounded-[4px] ${
            viewMode === 'roadmap'
              ? isDark
                ? 'bg-[#282828] text-[#f1f1f1]'
                : 'bg-white text-[#37352f] shadow-xs'
              : isDark
              ? 'text-[#888888]'
              : 'text-[#787774]'
          }`}
        >
          Roadmap
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('topics')}
          className={`flex-1 py-1 text-xs text-center rounded-[4px] ${
            viewMode === 'topics'
              ? isDark
                ? 'bg-[#282828] text-[#f1f1f1]'
                : 'bg-white text-[#37352f] shadow-xs'
              : isDark
              ? 'text-[#888888]'
              : 'text-[#787774]'
          }`}
        >
          Topics
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('table')}
          className={`flex-1 py-1 text-xs text-center rounded-[4px] ${
            viewMode === 'table'
              ? isDark
                ? 'bg-[#282828] text-[#f1f1f1]'
                : 'bg-white text-[#37352f] shadow-xs'
              : isDark
              ? 'text-[#888888]'
              : 'text-[#787774]'
          }`}
        >
          Table
        </button>
      </div>
    </header>
  );
};
