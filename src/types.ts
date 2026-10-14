export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type UserProblemStatus = 'unsolved' | 'solved' | 'revision';

export type RawDSAItem = {
  '#': string;
  'AM Topic': string;
  Problem: string;
  Difficulty: Difficulty;
  'LeetCode #': string;
  Link: string;
};

export type DSAProblem = {
  id: string;
  orderNum: number;
  topic: string;
  title: string;
  difficulty: Difficulty;
  leetcodeNum: string;
  link: string;
  phaseId: number;
  phaseTitle: string;
};

export type UserProblemData = {
  status: UserProblemStatus;
  isFavorite: boolean;
  notes?: string;
  solvedAt?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
};

export type PhaseInfo = {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  topics: string[];
  accentColor: string; // tailwind color token like 'emerald', 'sky', 'indigo', etc.
};

export type RoadmapViewMode = 'roadmap' | 'topics' | 'table';

export type FilterState = {
  searchQuery: string;
  difficulty: 'All' | Difficulty;
  status: 'All' | 'solved' | 'unsolved' | 'revision' | 'starred';
  selectedPhase: number | 'All';
  selectedTopic: string | 'All';
  sortBy: 'order' | 'leetcode' | 'difficulty' | 'name';
};
