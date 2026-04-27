import { readContext } from './context.js';
import { codexEpisodeSchema } from './episodeContract.js';

const compactSong = (song) => ({
  title: song.title,
  artist: song.artist,
  playlist: song.playlist,
  year: song.year,
  mood: song.mood,
  scene: song.scene,
});

export const buildCodexPrompt = async () => {
  const context = await readContext();
  const candidateSongs = context.playlists.slice(0, 20).map(compactSong);

  return {
    target: 'Codex',
    task: 'Generate one personal AI radio episode plan from local user context.',
    instructions: [
      'Act as a restrained personal radio DJ, not as a marketing copywriter.',
      'Use the user taste, routines, mood rules, and candidate songs as source-of-truth.',
      'Prefer a concrete recommendation with a short reason over broad analysis.',
      'Return JSON only. Do not include markdown fences.',
      'Keep DJ speech natural, concise, and suitable for audio playback.',
    ],
    context: {
      taste: context.taste,
      routines: context.routines,
      moodRules: context.moodRules,
      playlistSummary: context.summary,
      candidateSongs,
    },
    outputSchema: codexEpisodeSchema,
  };
};

export const buildCodexPromptSummary = async () => {
  const prompt = await buildCodexPrompt();

  return {
    target: prompt.target,
    task: prompt.task,
    instructionCount: prompt.instructions.length,
    candidateSongCount: prompt.context.candidateSongs.length,
    playlistSummary: prompt.context.playlistSummary,
    outputKeys: Object.keys(prompt.outputSchema),
  };
};
