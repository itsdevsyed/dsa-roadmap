import React from 'react';
import { Difficulty } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const { isDark } = useTheme();

  const lightStyles = {
    Easy: 'bg-[#dbeddb] text-[#1c3829] border-[#c0e0c0]',
    Medium: 'bg-[#fdecc8] text-[#402c1b] border-[#f8dc9e]',
    Hard: 'bg-[#ffe2dd] text-[#5d1715] border-[#fbc5bc]',
  }[difficulty];

  const darkStyles = {
    Easy: 'bg-[#448361]/25 text-[#64a37e] border-[#448361]/40',
    Medium: 'bg-[#d7a627]/22 text-[#d7a627] border-[#d7a627]/40',
    Hard: 'bg-[#e16b67]/25 text-[#e16b67] border-[#e16b67]/40',
  }[difficulty];

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-1.5 py-0.5 rounded-[4px]'
      : 'text-xs px-2 py-0.5 rounded-[4px]';

  return (
    <span
      className={`inline-flex items-center font-normal border leading-none select-none transition-colors ${
        isDark ? darkStyles : lightStyles
      } ${sizeClasses}`}
    >
      {difficulty}
    </span>
  );
};
