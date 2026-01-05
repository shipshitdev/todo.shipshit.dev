'use client';

import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';
import { createTasksApi, createProjectsApi, createHistoryApi, createGoalsApi } from '@/lib/api';

export function useApi() {
  const { getToken } = useAuth();

  const api = useMemo(() => ({
    tasks: createTasksApi(getToken),
    projects: createProjectsApi(getToken),
    history: createHistoryApi(getToken),
    goals: createGoalsApi(getToken),
  }), [getToken]);

  return api;
}
