import type { CodexEpisodePreview, CodexPromptSummary, RadioContext, TabId } from '../types';

type InfoPanelProps = {
  activeTab: Exclude<TabId, 'player'>;
  radioContext: RadioContext | null;
  contextError: string | null;
  promptSummary: CodexPromptSummary | null;
  promptError: string | null;
  episodePreview: CodexEpisodePreview | null;
  episodePreviewError: string | null;
};

const copy = {
  profile: {
    eyebrow: 'context model',
    title: 'Personal radio memory',
    items: [
      'taste.md: long-term taste, favorite years, disliked sounds.',
      'routines.md: work rhythm, sleep windows, focus periods.',
      'playlists.json: song library, playlist source, years, tags.',
      'mood-rules.md: weather, time, and mood matching rules.',
    ],
  },
  settings: {
    eyebrow: 'next integrations',
    title: 'Local service hooks',
    items: [
      'Codex generates episode JSON and DJ copy.',
      'Fish Audio converts DJ copy into cached speech.',
      'Netease API resolves songs, lyrics, and recommendations.',
      'WebSocket streams now-playing state into this player.',
    ],
  },
};

const contextItems = (radioContext: RadioContext | null, contextError: string | null) => {
  if (contextError) return [`Context API error: ${contextError}`];
  if (!radioContext) return ['Loading local context from /api/context.'];

  const yearRange = radioContext.summary.yearRange
    ? `${radioContext.summary.yearRange[0]}-${radioContext.summary.yearRange[1]}`
    : 'No year range yet';

  return [
    `${radioContext.summary.songCount} songs across ${radioContext.summary.artistCount} artists.`,
    `Year range: ${yearRange}.`,
    `Moods: ${radioContext.summary.moods.join(', ') || 'No moods yet'}.`,
    `Scenes: ${radioContext.summary.scenes.join(', ') || 'No scenes yet'}.`,
  ];
};

const promptItems = (
  promptSummary: CodexPromptSummary | null,
  promptError: string | null,
  episodePreview: CodexEpisodePreview | null,
  episodePreviewError: string | null,
) => {
  if (promptError) return [`Codex prompt API error: ${promptError}`];
  if (!promptSummary) return ['Loading Codex prompt summary from /api/codex/prompt/summary.'];
  if (episodePreviewError) return [`Codex episode preview API error: ${episodePreviewError}`];
  if (!episodePreview) return ['Loading Codex episode preview from /api/codex/episode-preview.'];
  if (!episodePreview.ok) return [`Preview validation failed: ${episodePreview.errors.join('; ')}`];

  return [
    `Target: ${promptSummary.target}.`,
    `Task: ${promptSummary.task}`,
    `${promptSummary.instructionCount} instructions and ${promptSummary.candidateSongCount} candidate songs prepared.`,
    `Preview episode: ${episodePreview.episode.title}, ${episodePreview.episode.turns.length} turns.`,
    `Selected song: ${episodePreview.selectedSong.title} - ${episodePreview.selectedSong.artist}.`,
  ];
};

export function InfoPanel({
  activeTab,
  radioContext,
  contextError,
  promptSummary,
  promptError,
  episodePreview,
  episodePreviewError,
}: InfoPanelProps) {
  const content = copy[activeTab];
  const items =
    activeTab === 'profile'
      ? contextItems(radioContext, contextError)
      : promptItems(promptSummary, promptError, episodePreview, episodePreviewError);

  return (
    <section className="panel info-panel">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
