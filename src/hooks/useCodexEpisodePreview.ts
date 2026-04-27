import { useCallback } from 'react';
import { API_ENDPOINTS } from '../config';
import { fetchJson } from '../lib/api';
import { useAsyncResource } from './useAsyncResource';
import type { CodexEpisodePreview } from '../types';

export function useCodexEpisodePreview() {
  return useAsyncResource<CodexEpisodePreview>(
    useCallback(() => fetchJson<CodexEpisodePreview>(API_ENDPOINTS.codexEpisodePreview), []),
    'Unable to load Codex episode preview.',
  );
}

