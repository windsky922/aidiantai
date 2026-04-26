import { useCallback } from 'react';
import { API_ENDPOINTS } from '../config';
import { fetchJson } from '../lib/api';
import { useAsyncResource } from './useAsyncResource';
import type { CodexPromptSummary } from '../types';

export function useCodexPromptSummary() {
  return useAsyncResource<CodexPromptSummary>(
    useCallback(() => fetchJson<CodexPromptSummary>(API_ENDPOINTS.codexPromptSummary), []),
    'Unable to load Codex prompt summary.',
  );
}

