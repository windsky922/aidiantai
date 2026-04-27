import { API_ENDPOINTS } from '../config';
import { useApiResource } from './useApiResource';
import type { CodexPromptSummary } from '../types';

export function useCodexPromptSummary() {
  return useApiResource<CodexPromptSummary>(
    API_ENDPOINTS.codexPromptSummary,
    'Unable to load Codex prompt summary.',
  );
}
