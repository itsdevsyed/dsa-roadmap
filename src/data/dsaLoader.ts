import rawProblems from './dsa.json';
import { DSAProblem, RawDSAItem } from '../types';
import { getPhaseForTopic } from './roadmapPhases';

export const allDSAProblems: DSAProblem[] = (rawProblems as RawDSAItem[]).map((raw, idx) => {
  const topic = (raw['AM Topic'] || 'Arrays').trim();
  const phase = getPhaseForTopic(topic);
  const orderNum = parseInt(raw['#'], 10) || idx + 1;
  const leetcodeNum = (raw['LeetCode #'] || '').trim();

  return {
    id: raw['#'] || String(idx + 1),
    orderNum,
    topic,
    title: (raw.Problem || `Problem #${orderNum}`).trim(),
    difficulty: raw.Difficulty || 'Medium',
    leetcodeNum,
    link: raw.Link || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(raw.Problem || '')}`,
    phaseId: phase.id,
    phaseTitle: phase.title,
  };
});

// Group problems by topic
export const problemsByTopic: Record<string, DSAProblem[]> = {};
allDSAProblems.forEach((problem) => {
  if (!problemsByTopic[problem.topic]) {
    problemsByTopic[problem.topic] = [];
  }
  problemsByTopic[problem.topic].push(problem);
});

// Unique topic list in order of appearance
export const allTopicsList: string[] = Array.from(
  new Set(allDSAProblems.map((p) => p.topic))
);

// Problem counts
export const totalProblemsCount = allDSAProblems.length;
export const easyCount = allDSAProblems.filter((p) => p.difficulty === 'Easy').length;
export const mediumCount = allDSAProblems.filter((p) => p.difficulty === 'Medium').length;
export const hardCount = allDSAProblems.filter((p) => p.difficulty === 'Hard').length;
