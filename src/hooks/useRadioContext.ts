import { API_ENDPOINTS } from '../config';
import { useApiResource } from './useApiResource';
import type { RadioContext } from '../types';

export function useRadioContext() {
  return useApiResource<RadioContext>(API_ENDPOINTS.context, 'Unable to load context.');
}
