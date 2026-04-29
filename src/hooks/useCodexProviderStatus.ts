import { API_ENDPOINTS } from '../config';
import { useApiResource } from './useApiResource';
import type { CodexProviderStatus } from '../types';

export function useCodexProviderStatus() {
  return useApiResource<CodexProviderStatus>(
    API_ENDPOINTS.codexProviderStatus,
    'Unable to load Codex provider status.',
  );
}
