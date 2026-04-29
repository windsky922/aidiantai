import { useRef, useState } from 'react';
import { AppStage } from './components/AppStage';
import { ErrorPanel } from './components/ErrorPanel';
import { InfoPanel } from './components/InfoPanel';
import { LoadingPanel } from './components/LoadingPanel';
import { PlayerHeader } from './components/PlayerHeader';
import { PlayerPanel } from './components/PlayerPanel';
import { Tabs } from './components/Tabs';
import { useCodexDraft } from './hooks/useCodexDraft';
import { useCodexEpisodePreview } from './hooks/useCodexEpisodePreview';
import { useCodexProviderStatus } from './hooks/useCodexProviderStatus';
import { useCodexPromptSummary } from './hooks/useCodexPromptSummary';
import { useClock } from './hooks/useClock';
import { useEpisode } from './hooks/useEpisode';
import { usePlayerController } from './hooks/usePlayerController';
import { useRadioContext } from './hooks/useRadioContext';
import { useTranscriptScroll } from './hooks/useTranscriptScroll';
import type { Episode, RadioContext, TabId } from './types';

export function App() {
  const episodeResource = useEpisode();

  if (episodeResource.status === 'loading') {
    return (
      <AppStage>
        <LoadingPanel />
      </AppStage>
    );
  }

  if (episodeResource.status === 'error') {
    return (
      <AppStage>
        <ErrorPanel error={episodeResource.error} />
      </AppStage>
    );
  }

  if (!episodeResource.data.ok) {
    return (
      <AppStage>
        <ErrorPanel error={episodeResource.data.error} />
      </AppStage>
    );
  }

  return <RadioApp episode={episodeResource.data.episode} />;
}

type RadioAppProps = {
  episode: Episode;
};

function RadioApp({ episode }: RadioAppProps) {
  const [activeTab, setActiveTab] = useState<TabId>('player');
  const [activeEpisode, setActiveEpisode] = useState(episode);
  const [previousEpisode, setPreviousEpisode] = useState<Episode | null>(null);
  const [isConfirmingDraftApply, setIsConfirmingDraftApply] = useState(false);
  const clock = useClock();
  const contextResource = useRadioContext();
  const promptResource = useCodexPromptSummary();
  const episodePreviewResource = useCodexEpisodePreview();
  const providerStatusResource = useCodexProviderStatus();
  const codexDraft = useCodexDraft();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const player = usePlayerController(activeEpisode);

  useTranscriptScroll(activeEpisode, player.time, transcriptRef);

  const changeTab = (tab: TabId) => {
    if (tab !== 'settings') setIsConfirmingDraftApply(false);
    setActiveTab(tab);
  };

  const generateDraft = () => {
    setIsConfirmingDraftApply(false);
    codexDraft.generateDraft();
  };

  const requestDraftApply = () => {
    if (codexDraft.draft.status !== 'ready' || !codexDraft.draft.data.preview.ok) return;
    setIsConfirmingDraftApply(true);
  };

  const confirmDraftApply = () => {
    if (codexDraft.draft.status !== 'ready' || !codexDraft.draft.data.preview.ok) return;
    setPreviousEpisode(activeEpisode);
    setActiveEpisode(codexDraft.draft.data.preview.episode);
    setIsConfirmingDraftApply(false);
    changeTab('player');
  };

  const restorePreviousEpisode = () => {
    if (!previousEpisode) return;
    setActiveEpisode(previousEpisode);
    setPreviousEpisode(null);
    setIsConfirmingDraftApply(false);
    changeTab('player');
  };

  const radioContext = contextResource.status === 'ready' ? contextResource.data : null;
  const contextError = contextResource.status === 'error' ? contextResource.error : null;
  const promptSummary = promptResource.status === 'ready' ? promptResource.data : null;
  const promptError = promptResource.status === 'error' ? promptResource.error : null;
  const episodePreview = episodePreviewResource.status === 'ready' ? episodePreviewResource.data : null;
  const episodePreviewError = episodePreviewResource.status === 'error' ? episodePreviewResource.error : null;
  const providerStatus = providerStatusResource.status === 'ready' ? providerStatusResource.data : null;
  const providerStatusError = providerStatusResource.status === 'error' ? providerStatusResource.error : null;

  return (
    <AppStage>
      <section className="device" aria-label="Claudio FM player">
        <Tabs activeTab={activeTab} onChange={changeTab} />
        <PlayerHeader host={activeEpisode.host} isPlaying={player.isPlaying} clock={clock} canvasRef={player.canvasRef} />

        {activeTab === 'player' ? (
          <PlayerPanel
            episode={activeEpisode}
            isPlaying={player.isPlaying}
            time={player.time}
            progress={player.progress}
            transcriptRef={transcriptRef}
            onSeek={player.seek}
            onTogglePlayback={player.togglePlayback}
          />
        ) : (
          <InfoPanel
            activeTab={activeTab}
            radioContext={radioContext}
            contextError={contextError}
            promptSummary={promptSummary}
            promptError={promptError}
            episodePreview={episodePreview}
            episodePreviewError={episodePreviewError}
            providerStatus={providerStatus}
            providerStatusError={providerStatusError}
            codexDraft={codexDraft.draft}
            activeEpisodeTitle={activeEpisode.title}
            canRestoreEpisode={Boolean(previousEpisode)}
            isConfirmingDraftApply={isConfirmingDraftApply}
            onGenerateDraft={generateDraft}
            onRequestDraftApply={requestDraftApply}
            onConfirmDraftApply={confirmDraftApply}
            onCancelDraftApply={() => setIsConfirmingDraftApply(false)}
            onRestoreEpisode={restorePreviousEpisode}
          />
        )}
      </section>
    </AppStage>
  );
}
