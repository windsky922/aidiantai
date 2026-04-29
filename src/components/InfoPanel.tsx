import type { ActionResource } from '../lib/api';
import type { CodexDraft, CodexEpisodePreview, CodexPromptSummary, RadioContext, TabId } from '../types';

type InfoPanelProps = {
  activeTab: Exclude<TabId, 'player'>;
  radioContext: RadioContext | null;
  contextError: string | null;
  promptSummary: CodexPromptSummary | null;
  promptError: string | null;
  episodePreview: CodexEpisodePreview | null;
  episodePreviewError: string | null;
  codexDraft: ActionResource<CodexDraft>;
  onGenerateDraft: () => void;
  onApplyDraft: () => void;
};

const copy = {
  profile: {
    eyebrow: 'context model',
    title: 'Personal radio memory',
  },
  settings: {
    eyebrow: 'draft generator',
    title: 'Codex episode draft',
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
  codexDraft: ActionResource<CodexDraft>,
) => {
  if (promptError) return [`Codex prompt API error: ${promptError}`];
  if (!promptSummary) return ['Loading Codex prompt summary from /api/codex/prompt/summary.'];
  if (episodePreviewError) return [`Codex episode preview API error: ${episodePreviewError}`];
  if (!episodePreview) return ['Loading Codex episode preview from /api/codex/episode-preview.'];
  if (!episodePreview.ok) return [`Preview validation failed: ${episodePreview.errors.join('; ')}`];

  const items = [
    `Target: ${promptSummary.target}.`,
    `Task: ${promptSummary.task}`,
    `${promptSummary.instructionCount} instructions and ${promptSummary.candidateSongCount} candidate songs prepared.`,
    `Preview episode: ${episodePreview.episode.title}, ${episodePreview.episode.turns.length} turns.`,
    `Selected song: ${episodePreview.selectedSong.title} - ${episodePreview.selectedSong.artist}.`,
  ];

  if (codexDraft.status === 'loading') {
    return [...items, 'Generating draft and validating episode contract.'];
  }
  if (codexDraft.status === 'error') {
    return [...items, `Draft API error: ${codexDraft.error}`];
  }
  if (codexDraft.status === 'ready') {
    const { data } = codexDraft;
    if (!data.preview.ok) return [...items, `Draft validation failed: ${data.preview.errors.join('; ')}`];

    return [
      ...items,
      `Draft provider: ${data.provider}${data.model ? ` (${data.model})` : ''}.`,
      `Draft source: ${data.source}.`,
      `Draft episode: ${data.preview.episode.title}, ${data.preview.episode.turns.length} turns.`,
    ];
  }

  return items;
};

export function InfoPanel({
  activeTab,
  radioContext,
  contextError,
  promptSummary,
  promptError,
  episodePreview,
  episodePreviewError,
  codexDraft,
  onGenerateDraft,
  onApplyDraft,
}: InfoPanelProps) {
  const content = copy[activeTab];
  const items =
    activeTab === 'profile'
      ? contextItems(radioContext, contextError)
      : promptItems(promptSummary, promptError, episodePreview, episodePreviewError, codexDraft);

  return (
    <section className="panel info-panel">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {activeTab === 'settings' && (
        <div className="draft-actions">
          <button
            className="draft-button"
            type="button"
            disabled={codexDraft.status === 'loading'}
            onClick={onGenerateDraft}
          >
            {codexDraft.status === 'loading' ? 'Generating...' : 'Generate draft'}
          </button>
          <button
            className="draft-button secondary"
            type="button"
            disabled={codexDraft.status !== 'ready' || !codexDraft.data.preview.ok}
            onClick={onApplyDraft}
          >
            Apply to player
          </button>
        </div>
      )}
    </section>
  );
}
