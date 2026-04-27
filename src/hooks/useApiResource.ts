import { useCallback } from 'react';
import { fetchJson } from '../lib/api';
import { useAsyncResource } from './useAsyncResource';

export function useApiResource<T>(url: string, fallbackError: string) {
  return useAsyncResource<T>(useCallback(() => fetchJson<T>(url), [url]), fallbackError);
}
