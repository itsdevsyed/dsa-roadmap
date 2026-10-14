import { useState, useEffect, useCallback } from 'react';
import { UserProblemData, UserProblemStatus } from '../types';

const STORAGE_KEY = 'dsa_roadmap_progress_v1';

// Initial pre-filled sample progress so new users see how the roadmap works
const INITIAL_SAMPLE_PROGRESS: Record<string, UserProblemData> = {
  '1': { status: 'solved', isFavorite: true, solvedAt: '2026-10-10T12:00:00Z', notes: 'Simple single pass tracking max count with count = num === 1 ? count + 1 : 0.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' },
  '3': { status: 'solved', isFavorite: false, solvedAt: '2026-10-11T14:30:00Z', notes: 'Two pointers: non-zero write pointer tracking placement position.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' },
  '8': { status: 'solved', isFavorite: true, solvedAt: '2026-10-12T09:15:00Z', notes: 'Track minPrice so far, profit = max(profit, price - minPrice).', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' },
  '12': { status: 'revision', isFavorite: true, notes: 'Need to review prefix and suffix product passes without division!', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' },
  '22': { status: 'solved', isFavorite: false, solvedAt: '2026-10-12T16:20:00Z', notes: 'Filter alphanumeric chars and use two pointers from edges inward.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' },
  '49': { status: 'solved', isFavorite: false, solvedAt: '2026-10-13T01:10:00Z', notes: 'Direct bucket array with separate chaining for collisions.', timeComplexity: 'O(1) amortized', spaceComplexity: 'O(N)' },
  '72': { status: 'solved', isFavorite: true, solvedAt: '2026-10-13T02:00:00Z', notes: 'Hash map of complement target - num -> index.', timeComplexity: 'O(N)', spaceComplexity: 'O(N)' },
  '77': { status: 'revision', isFavorite: true, notes: 'Two pointers at bounds; move pointer with smaller height inwards.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' },
  '103': { status: 'revision', isFavorite: true, notes: 'Sliding window tracking character set and shrinking left on collision.', timeComplexity: 'O(N)', spaceComplexity: 'O(min(N, Alphabet))' },
};

export function useRoadmapStorage() {
  const [userState, setUserState] = useState<Record<string, UserProblemData>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read from localStorage', e);
    }
    return INITIAL_SAMPLE_PROGRESS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [userState]);

  const getProblemData = useCallback(
    (problemId: string): UserProblemData => {
      return (
        userState[problemId] || {
          status: 'unsolved',
          isFavorite: false,
        }
      );
    },
    [userState]
  );

  const toggleSolved = useCallback((problemId: string) => {
    setUserState((prev) => {
      const current = prev[problemId] || { status: 'unsolved', isFavorite: false };
      const nextStatus: UserProblemStatus = current.status === 'solved' ? 'unsolved' : 'solved';
      return {
        ...prev,
        [problemId]: {
          ...current,
          status: nextStatus,
          solvedAt: nextStatus === 'solved' ? new Date().toISOString() : undefined,
        },
      };
    });
  }, []);

  const toggleRevision = useCallback((problemId: string) => {
    setUserState((prev) => {
      const current = prev[problemId] || { status: 'unsolved', isFavorite: false };
      const nextStatus: UserProblemStatus = current.status === 'revision' ? 'unsolved' : 'revision';
      return {
        ...prev,
        [problemId]: {
          ...current,
          status: nextStatus,
        },
      };
    });
  }, []);

  const toggleFavorite = useCallback((problemId: string) => {
    setUserState((prev) => {
      const current = prev[problemId] || { status: 'unsolved', isFavorite: false };
      return {
        ...prev,
        [problemId]: {
          ...current,
          isFavorite: !current.isFavorite,
        },
      };
    });
  }, []);

  const saveProblemNotes = useCallback(
    (
      problemId: string,
      data: {
        notes?: string;
        timeComplexity?: string;
        spaceComplexity?: string;
        status?: UserProblemStatus;
      }
    ) => {
      setUserState((prev) => {
        const current = prev[problemId] || { status: 'unsolved', isFavorite: false };
        return {
          ...prev,
          [problemId]: {
            ...current,
            ...data,
            status: data.status !== undefined ? data.status : current.status,
          },
        };
      });
    },
    []
  );

  const resetAllProgress = useCallback(() => {
    setUserState({});
  }, []);

  const exportProgress = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dsa-vault-progress-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [userState]);

  const importProgress = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        setUserState(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file', e);
    }
    return false;
  }, []);

  return {
    userState,
    getProblemData,
    toggleSolved,
    toggleRevision,
    toggleFavorite,
    saveProblemNotes,
    resetAllProgress,
    exportProgress,
    importProgress,
  };
}
