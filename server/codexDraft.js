import { buildCodexPrompt } from './codexPrompt.js';
import { buildEpisodePreview } from './episodeContract.js';
import { generateCodexEpisodePlan } from './codexProvider.js';

const summarizePrompt = (prompt) => ({
  target: prompt.target,
  task: prompt.task,
  instructionCount: prompt.instructions.length,
  candidateSongCount: prompt.context.candidateSongs.length,
});

export const buildCodexDraft = async () => {
  const prompt = await buildCodexPrompt();
  const result = await generateCodexEpisodePlan(prompt);

  return {
    source: result.source,
    provider: result.provider,
    model: result.model,
    generatedAt: new Date().toISOString(),
    prompt: summarizePrompt(prompt),
    preview: buildEpisodePreview(result.output),
  };
};
