import { useCallback } from 'react';
import { API_ENDPOINTS } from '../config';
import { fetchJson } from '../lib/api';
import { useAsyncResource } from './useAsyncResource';
import type { RadioContext } from '../types';

export function useRadioContext() {
  return useAsyncResource<RadioContext>(
    useCallback(() => fetchJson<RadioContext>(API_ENDPOINTS.context), []),
    'Unable to load context.',
  );
}

