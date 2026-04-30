import { useEffect, useRef } from 'react';
import type { ActionResource } from '../lib/api';
import type {
  CodexDraft,
  CodexEpisodePreview,
  CodexPromptSummary,
  CodexProviderStatus,
  RadioContext,
  TabId,
} from '../types';

type InfoPanelProps = {
  activeTab: Exclude<TabId, 'player'>;
  radioContext: RadioContext | null;
  contextError: string | null;
  promptSummary: CodexPromptSummary | null;
  promptError: string | null;
  episodePreview: CodexEpisodePreview | null;
  episodePreviewError: string | null;
  providerStatus: CodexProviderStatus | null;
  providerStatusError: string | null;
  codexDraft: ActionResource<CodexDraft>;
  draftHistory: CodexDraft[];
  activeEpisodeTitle: string;
  canRestoreEpisode: boolean;
  isConfirmingDraftApply: boolean;
  isConfirmingExternalDraftGeneration: boolean;
  onGenerateDraft: () => void;
  onConfirmExternalDraftGeneration: () => void;
  onCancelExternalDraftGeneration: () => void;
  onSelectHistoryDraft: (draft: CodexDraft) => void;
  onRequestDraftApply: () => void;
  onConfirmDraftApply: () => void;
  onCancelDraftApply: () => void;
  onRestoreEpisode: () => void;
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
  providerStatus: CodexProviderStatus | null,
  providerStatusError: string | null,
  codexDraft: ActionResource<CodexDraft>,
  activeEpisodeTitle: string,
) => {
  if (promptError) return [`Codex prompt API error: ${promptError}`];
  if (!promptSummary) return ['Loading Codex prompt summary from /api/codex/prompt/summary.'];
  if (episodePreviewError) return [`Codex episode preview API error: ${episodePreviewError}`];
  if (!episodePreview) return ['Loading Codex episode preview from /api/codex/episode-preview.'];
  if (!episodePreview.ok) return [`Preview validation failed: ${episodePreview.errors.join('; ')}`];
  if (providerStatusError) return [`Codex provider status API error: ${providerStatusError}`];
  if (!providerStatus) return ['Loading Codex provider status from /api/codex/provider-status.'];

  const items = [
    `Target: ${promptSummary.target}.`,
    `Task: ${promptSummary.task}`,
    `${promptSummary.instructionCount} instructions and ${promptSummary.candidateSongCount} candidate songs prepared.`,
    `Provider: ${providerStatus.provider}${providerStatus.model ? ` (${providerStatus.model})` : ''}.`,
    `Provider status: ${providerStatus.message}`,
    `External requests: ${providerStatus.externalRequests ? 'enabled' : 'disabled'}.`,
    `Player episode: ${activeEpisodeTitle}.`,
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

const formatDraftTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function InfoPanel({
  activeTab,
  radioContext,
  contextError,
  promptSummary,
  promptError,
  episodePreview,
  episodePreviewError,
  providerStatus,
  providerStatusError,
  codexDraft,
  draftHistory,
  activeEpisodeTitle,
  canRestoreEpisode,
  isConfirmingDraftApply,
  isConfirmingExternalDraftGeneration,
  onGenerateDraft,
  onConfirmExternalDraftGeneration,
  onCancelExternalDraftGeneration,
  onSelectHistoryDraft,
  onRequestDraftApply,
  onConfirmDraftApply,
  onCancelDraftApply,
  onRestoreEpisode,
}: InfoPanelProps) {
  const confirmationRef = useRef<HTMLDivElement | null>(null);
  const content = copy[activeTab];
  const items =
    activeTab === 'profile'
      ? contextItems(radioContext, contextError)
      : promptItems(
          promptSummary,
          promptError,
          episodePreview,
          episodePreviewError,
          providerStatus,
          providerStatusError,
          codexDraft,
          activeEpisodeTitle,
        );

  useEffect(() => {
    if (!isConfirmingDraftApply) return;
    confirmationRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [isConfirmingDraftApply]);

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
            className={`draft-button ${codexDraft.status === 'loading' ? 'loading' : ''}`}
            type="button"
            disabled={codexDraft.status === 'loading' || providerStatus?.ok !== true}
            onClick={onGenerateDraft}
          >
            {codexDraft.status === 'loading' ? 'Generating...' : 'Generate draft'}
          </button>
          {providerStatus && !providerStatus.ok && (
            <div className="draft-confirmation" role="status">
              <p className="eyebrow">provider blocked</p>
              <strong>{providerStatus.provider}</strong>
              <p>{providerStatus.message}</p>
            </div>
          )}
          {isConfirmingExternalDraftGeneration && providerStatus?.externalRequests && (
            <div className="draft-confirmation" role="group" aria-label="Confirm external draft generation">
              <p className="eyebrow">external request</p>
              <strong>
                {providerStatus.provider}
                {providerStatus.model ? ` (${providerStatus.model})` : ''}
              </strong>
              <p>Local taste, routine, mood-rule, and playlist context will be sent for draft generation.</p>
              <div className="draft-confirmation-actions">
                <button className="draft-button secondary compact" type="button" onClick={onCancelExternalDraftGeneration}>
                  Cancel
                </button>
                <button className="draft-button compact" type="button" onClick={onConfirmExternalDraftGeneration}>
                  Continue
                </button>
              </div>
            </div>
          )}
          <button
            className="draft-button secondary"
            type="button"
            disabled={codexDraft.status !== 'ready' || !codexDraft.data.preview.ok}
            onClick={onRequestDraftApply}
          >
            Apply to player
          </button>
          {isConfirmingDraftApply && codexDraft.status === 'ready' && codexDraft.data.preview.ok && (
            <div
              className="draft-confirmation"
              ref={confirmationRef}
              role="group"
              aria-label="Confirm draft application"
            >
              <p className="eyebrow">confirm replace</p>
              <strong>
                {activeEpisodeTitle}
                {' -> '}
                {codexDraft.data.preview.episode.title}
              </strong>
              <p>
                {codexDraft.data.provider}
                {codexDraft.data.model ? ` (${codexDraft.data.model})` : ''} draft,{' '}
                {codexDraft.data.preview.episode.turns.length} turns.
              </p>
              <div className="draft-confirmation-actions">
                <button className="draft-button secondary compact" type="button" onClick={onCancelDraftApply}>
                  Cancel
                </button>
                <button className="draft-button compact" type="button" onClick={onConfirmDraftApply}>
                  Confirm
                </button>
              </div>
            </div>
          )}
          <button
            className="draft-button secondary"
            type="button"
            disabled={!canRestoreEpisode}
            onClick={onRestoreEpisode}
          >
            Restore previous
          </button>
          {draftHistory.length > 0 && (
            <section className="draft-history" aria-label="Draft history">
              <p className="eyebrow">draft history</p>
              {draftHistory.map((draft) => {
                const title = draft.preview.ok ? draft.preview.episode.title : 'Invalid draft';
                const turnCount = draft.preview.ok ? draft.preview.episode.turns.length : 0;

                return (
                  <button
                    className="draft-history-item"
                    key={draft.generatedAt}
                    type="button"
                    onClick={() => onSelectHistoryDraft(draft)}
                  >
                    <span>{title}</span>
                    <small>
                      {formatDraftTime(draft.generatedAt)} · {draft.provider} · {turnCount} turns
                    </small>
                  </button>
                );
              })}
            </section>
          )}
        </div>
      )}
    </section>
  );
}
