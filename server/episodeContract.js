import { readFile } from 'node:fs/promises';

const sampleOutputUrl = new URL('../data/codex-sample-output.json', import.meta.url);

export const codexEpisodeSchema = {
  episodeTitle: 'string',
  subtitle: 'string',
  host: 'string',
  duration: 'number',
  songPreview: 'string',
  djSay: 'string',
  selectedSong: {
    title: 'string',
    artist: 'string',
    reason: 'string',
    mood: ['string'],
    scene: ['string'],
  },
  turns: [
    {
      speaker: 'Claudio',
      start: 'number',
      text: 'string',
    },
  ],
};

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isPositiveNumber = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;
const isNonNegativeNumber = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;

const validateTurn = (turn, index, duration) => {
  const errors = [];

  if (!isRecord(turn)) return [`turns[${index}] must be an object`];
  if (turn.speaker !== 'Claudio' && turn.speaker !== 'You') {
    errors.push(`turns[${index}].speaker must be "Claudio" or "You"`);
  }
  if (!isNonNegativeNumber(turn.start)) errors.push(`turns[${index}].start must be a non-negative number`);
  if (isNonNegativeNumber(turn.start) && turn.start > duration) {
    errors.push(`turns[${index}].start must not exceed duration`);
  }
  if (!isNonEmptyString(turn.text)) errors.push(`turns[${index}].text must be a non-empty string`);

  return errors;
};

export const validateCodexEpisodePlan = (plan) => {
  const errors = [];

  if (!isRecord(plan)) return ['Codex output must be an object'];
  if (!isNonEmptyString(plan.episodeTitle)) errors.push('episodeTitle must be a non-empty string');
  if (!isNonEmptyString(plan.subtitle)) errors.push('subtitle must be a non-empty string');
  if (!isNonEmptyString(plan.host)) errors.push('host must be a non-empty string');
  if (!isPositiveNumber(plan.duration)) errors.push('duration must be a positive number');
  if (!isNonEmptyString(plan.songPreview)) errors.push('songPreview must be a non-empty string');
  if (!isNonEmptyString(plan.djSay)) errors.push('djSay must be a non-empty string');
  if (!isRecord(plan.selectedSong)) errors.push('selectedSong must be an object');

  if (isRecord(plan.selectedSong)) {
    if (!isNonEmptyString(plan.selectedSong.title)) errors.push('selectedSong.title must be a non-empty string');
    if (!isNonEmptyString(plan.selectedSong.artist)) errors.push('selectedSong.artist must be a non-empty string');
    if (!isNonEmptyString(plan.selectedSong.reason)) errors.push('selectedSong.reason must be a non-empty string');
  }

  if (!Array.isArray(plan.turns) || plan.turns.length === 0) {
    errors.push('turns must be a non-empty array');
  } else {
    plan.turns.forEach((turn, index) => {
      errors.push(...validateTurn(turn, index, plan.duration));
      if (index > 0 && isNonNegativeNumber(turn?.start) && turn.start < plan.turns[index - 1].start) {
        errors.push(`turns[${index}].start must be in chronological order`);
      }
    });
  }

  return errors;
};

export const planToEpisode = (plan) => ({
  host: plan.host,
  title: plan.episodeTitle,
  subtitle: plan.subtitle,
  duration: plan.duration,
  songPreview: plan.songPreview,
  turns: plan.turns.map((turn) => ({
    speaker: turn.speaker,
    start: turn.start,
    text: turn.text,
  })),
});

export const buildEpisodePreview = (plan) => {
  const errors = validateCodexEpisodePlan(plan);
  if (errors.length) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    errors: [],
    episode: planToEpisode(plan),
    selectedSong: plan.selectedSong,
  };
};

export const readCodexSampleOutput = async () => JSON.parse(await readFile(sampleOutputUrl, 'utf8'));

