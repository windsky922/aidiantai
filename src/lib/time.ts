import type { Turn } from '../types';

export const formatTime = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
};

export const getTurnEnd = (turns: Turn[], index: number, total: number) =>
  turns[index + 1] ? turns[index + 1].start - 0.15 : total;

