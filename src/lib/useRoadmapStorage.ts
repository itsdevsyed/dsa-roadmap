import { useState, useEffect, useCallback } from 'react';
import type { UserProblemData, UserProblemStatus } from '../types';
import { supabase } from '../utils/supabase';


const STORAGE_KEY = 'dsa_roadmap_progress_v1';

type ProgressRow = {
problem_id: string;
status: UserProblemStatus;
is_favorite: boolean;
solved_at: string | null;
notes: string | null;
time_complexity: string | null;
space_complexity: string | null;
};

export function useRoadmapStorage() {
const [userState, setUserState] = useState<Record<string, UserProblemData>>({});
const [isLoaded, setIsLoaded] = useState(false);

// Load the signed-in user's progress from Supabase.
useEffect(() => {
let cancelled = false;

async function loadProgress() {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError) throw authError;

    if (!authData.user) {
      if (!cancelled) {
        setUserState({});
        setIsLoaded(true);
      }
      return;
    }

    const { data, error } = await supabase
      .from('dsa_progress')
      .select('*')
      .eq('user_id', authData.user.id);

    if (error) throw error;

    const progress: Record<string, UserProblemData> = {};

    for (const row of (data ?? []) as ProgressRow[]) {
      progress[row.problem_id] = {
        status: row.status,
        isFavorite: row.is_favorite,
        solvedAt: row.solved_at ?? undefined,
        notes: row.notes ?? undefined,
        timeComplexity: row.time_complexity ?? undefined,
        spaceComplexity: row.space_complexity ?? undefined,
      };
    }

    if (!cancelled) {
      setUserState(progress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  } catch (error) {
    console.error('Failed to load DSA progress from Supabase:', error);

    if (!cancelled) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        setUserState(cached ? JSON.parse(cached) : {});
      } catch {
        setUserState({});
      }
    }
  } finally {
    if (!cancelled) setIsLoaded(true);
  }
}

loadProgress();

return () => {
  cancelled = true;
};

}, []);

// Cache locally and synchronize changes with Supabase.
useEffect(() => {
if (!isLoaded) return;


localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));

let cancelled = false;

async function syncProgress() {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError) throw authError;
    if (!authData.user) return;

    const rows = Object.entries(userState).map(([problemId, item]) => ({
      problem_id: problemId,
      user_id: authData.user!.id,
      status: item.status,
      is_favorite: item.isFavorite,
      solved_at: item.solvedAt ?? null,
      notes: item.notes ?? null,
      time_complexity: item.timeComplexity ?? null,
      space_complexity: item.spaceComplexity ?? null,
      updated_at: new Date().toISOString(),
    }));

    if (rows.length > 0 && !cancelled) {
      const { error } = await supabase
        .from('dsa_progress')
        .upsert(rows, { onConflict: 'problem_id' });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Failed to sync DSA progress:', error);
  }
}

syncProgress();

return () => {
  cancelled = true;
};

}, [userState, isLoaded]);

const getProblemData = useCallback(
(problemId: string): UserProblemData =>
userState[problemId] ?? {
status: 'unsolved',
isFavorite: false,
},
[userState]
);

const toggleSolved = useCallback((problemId: string) => {
setUserState((prev) => {
const current = prev[problemId] ?? {
status: 'unsolved' as UserProblemStatus,
isFavorite: false,
};

  const nextStatus: UserProblemStatus =
    current.status === 'solved' ? 'unsolved' : 'solved';

  return {
    ...prev,
    [problemId]: {
      ...current,
      status: nextStatus,
      solvedAt:
        nextStatus === 'solved' ? new Date().toISOString() : undefined,
    },
  };
});

}, []);

const toggleRevision = useCallback((problemId: string) => {
setUserState((prev) => {
const current = prev[problemId] ?? {
status: 'unsolved' as UserProblemStatus,
isFavorite: false,
};
  return {
    ...prev,
    [problemId]: {
      ...current,
      status:
        current.status === 'revision' ? 'unsolved' : 'revision',
    },
  };
});

}, []);

const toggleFavorite = useCallback((problemId: string) => {
setUserState((prev) => {
const current = prev[problemId] ?? {
status: 'unsolved' as UserProblemStatus,
isFavorite: false,
};


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
const current = prev[problemId] ?? {
status: 'unsolved' as UserProblemStatus,
isFavorite: false,
};

    return {
      ...prev,
      [problemId]: {
        ...current,
        ...data,
        status: data.status ?? current.status,
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
const blob = new Blob([JSON.stringify(userState, null, 2)], {
type: 'application/json',
});
const url = URL.createObjectURL(blob);
const anchor = document.createElement('a');
anchor.href = url;
anchor.download = `dsa-vault-progress-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
anchor.click();
URL.revokeObjectURL(url);
}, [userState]);

const importProgress = useCallback((jsonStr: string) => {
try {
const parsed = JSON.parse(jsonStr);

  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    !Array.isArray(parsed)
  ) {
    setUserState(parsed);
    return true;
  }
} catch (error) {
  console.error('Invalid progress JSON:', error);
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
