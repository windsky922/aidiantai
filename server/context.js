import { readFile } from 'node:fs/promises';

const contextFiles = {
  taste: new URL('../data/taste.md', import.meta.url),
  routines: new URL('../data/routines.md', import.meta.url),
  moodRules: new URL('../data/mood-rules.md', import.meta.url),
  playlists: new URL('../data/playlists.json', import.meta.url),
};

const readText = async (url) => readFile(url, 'utf8');

const readJson = async (url) => JSON.parse(await readText(url));

const summarizePlaylists = (songs) => {
  const years = songs.map((song) => song.year).filter((year) => typeof year === 'number');
  const artists = new Set(songs.map((song) => song.artist).filter(Boolean));
  const moods = new Set(songs.flatMap((song) => (Array.isArray(song.mood) ? song.mood : [])));
  const scenes = new Set(songs.flatMap((song) => (Array.isArray(song.scene) ? song.scene : [])));

  return {
    songCount: songs.length,
    artistCount: artists.size,
    yearRange: years.length ? [Math.min(...years), Math.max(...years)] : null,
    moods: Array.from(moods).slice(0, 12),
    scenes: Array.from(scenes).slice(0, 12),
  };
};

export const readContext = async () => {
  const [taste, routines, moodRules, playlists] = await Promise.all([
    readText(contextFiles.taste),
    readText(contextFiles.routines),
    readText(contextFiles.moodRules),
    readJson(contextFiles.playlists),
  ]);

  return {
    taste,
    routines,
    moodRules,
    playlists,
    summary: summarizePlaylists(playlists),
  };
};

