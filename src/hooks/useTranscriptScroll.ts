import { useEffect, useMemo } from 'react';
import type { RefObject } from 'react';
import { getTurnEnd } from '../lib/time';
import type { Episode } from '../types';

export function useTranscriptScroll(episode: Episode, time: number, transcriptRef: RefObject<HTMLDivElement | null>) {
  const activeTurnIndex = useMemo(
    () =>
      episode.turns.findIndex((turn, index) => {
        const end = getTurnEnd(episode.turns, index, episode.duration);
        return time >= turn.start && time < end;
      }),
    [episode.duration, episode.turns, time],
  );

  useEffect(() => {
    const active = document.querySelector<HTMLDivElement>('[data-active-turn="true"]');
    if (active && transcriptRef.current) {
      transcriptRef.current.scrollTo({
        top: active.offsetTop - 20,
        behavior: 'smooth',
      });
    }
  }, [activeTurnIndex, transcriptRef]);
}

