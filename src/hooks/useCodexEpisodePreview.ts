import { API_ENDPOINTS } from '../config';
import { useApiResource } from './useApiResource';
import type { CodexEpisodePreview } from '../types';

export function useCodexEpisodePreview() {
  return useApiResource<CodexEpisodePreview>(
    API_ENDPOINTS.codexEpisodePreview,
    'Unable to load Codex episode preview.',
  );
}
