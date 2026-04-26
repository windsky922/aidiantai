import type { Episode, EpisodeResult, Speaker, Turn } from '../types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readString = (source: Record<string, unknown>, key: string) => {
  const value = source[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
};

const readNumber = (source: Record<string, unknown>, key: string) => {
  const value = source[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

const readSpeaker = (value: unknown): Speaker | null => {
  if (value === 'Claudio' || value === 'You') return value;
  return null;
};

const parseTurn = (value: unknown, index: number): Turn | string => {
  if (!isRecord(value)) return `turns[${index}] must be an object`;

  const speaker = readSpeaker(value.speaker);
  if (!speaker) return `turns[${index}].speaker must be "Claudio" or "You"`;

  const start = readNumber(value, 'start');
  if (start === null || start < 0) return `turns[${index}].start must be a non-negative number`;

  const text = readString(value, 'text');
  if (!text) return `turns[${index}].text must be a non-empty string`;

  return { speaker, start, text };
};

export const parseEpisode = (source: unknown): EpisodeResult => {
  if (!isRecord(source)) {
    return { ok: false, error: 'Episode data must be an object.' };
  }

  const host = readString(source, 'host');
  const title = readString(source, 'title');
  const subtitle = readString(source, 'subtitle');
  const songPreview = readString(source, 'songPreview');
  const duration = readNumber(source, 'duration');

  if (!host) return { ok: false, error: 'Episode host is missing.' };
  if (!title) return { ok: false, error: 'Episode title is missing.' };
  if (!subtitle) return { ok: false, error: 'Episode subtitle is missing.' };
  if (!songPreview) return { ok: false, error: 'Episode songPreview is missing.' };
  if (duration === null || duration <= 0) {
    return { ok: false, error: 'Episode duration must be greater than 0.' };
  }

  const rawTurns = source.turns;
  if (!Array.isArray(rawTurns) || rawTurns.length === 0) {
    return { ok: false, error: 'Episode turns must be a non-empty array.' };
  }

  const turns: Turn[] = [];
  for (let index = 0; index < rawTurns.length; index += 1) {
    const parsed = parseTurn(rawTurns[index], index);
    if (typeof parsed === 'string') return { ok: false, error: parsed };
    if (parsed.start > duration) {
      return { ok: false, error: `turns[${index}].start must not exceed episode duration.` };
    }
    if (turns[index - 1] && parsed.start < turns[index - 1].start) {
      return { ok: false, error: `turns[${index}].start must be in chronological order.` };
    }
    turns.push(parsed);
  }

  return {
    ok: true,
    episode: {
      host,
      title,
      subtitle,
      duration,
      songPreview,
      turns,
    },
  };
};

