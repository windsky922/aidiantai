import { useCallback } from 'react';
import { API_ENDPOINTS } from '../config';
import { fetchJson } from '../lib/api';
import { parseEpisode } from '../lib/episode';
import { useAsyncResource } from './useAsyncResource';
import type { EpisodeResult } from '../types';

export function useEpisode() {
  return useAsyncResource<EpisodeResult>(
    useCallback(async () => {
      const payload = await fetchJson<unknown>(API_ENDPOINTS.episode);
      return parseEpisode(payload);
    }, []),
    'Unable to load episode data.',
  );
}

