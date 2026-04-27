import { buildCodexPrompt } from './codexPrompt.js';
import { buildEpisodePreview, readCodexSampleOutput } from './episodeContract.js';

const summarizePrompt = (prompt) => ({
  target: prompt.target,
  task: prompt.task,
  instructionCount: prompt.instructions.length,
  candidateSongCount: prompt.context.candidateSongs.length,
});

export const buildCodexDraft = async () => {
  const [prompt, output] = await Promise.all([buildCodexPrompt(), readCodexSampleOutput()]);

  return {
    source: 'sample-output',
    generatedAt: new Date().toISOString(),
    prompt: summarizePrompt(prompt),
    preview: buildEpisodePreview(output),
  };
};
