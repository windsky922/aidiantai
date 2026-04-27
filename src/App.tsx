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
  const clock = useClock();
  const contextResource = useRadioContext();
  const promptResource = useCodexPromptSummary();
  const episodePreviewResource = useCodexEpisodePreview();
  const codexDraft = useCodexDraft();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const player = usePlayerController(episode);

  useTranscriptScroll(episode, player.time, transcriptRef);

  const radioContext = contextResource.status === 'ready' ? contextResource.data : null;
  const contextError = contextResource.status === 'error' ? contextResource.error : null;
  const promptSummary = promptResource.status === 'ready' ? promptResource.data : null;
  const promptError = promptResource.status === 'error' ? promptResource.error : null;
  const episodePreview = episodePreviewResource.status === 'ready' ? episodePreviewResource.data : null;
  const episodePreviewError = episodePreviewResource.status === 'error' ? episodePreviewResource.error : null;

  return (
    <AppStage>
      <section className="device" aria-label="Claudio FM player">
        <Tabs activeTab={activeTab} onChange={setActiveTab} />
        <PlayerHeader host={episode.host} isPlaying={player.isPlaying} clock={clock} canvasRef={player.canvasRef} />

        {activeTab === 'player' ? (
          <PlayerPanel
            episode={episode}
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
            codexDraft={codexDraft.draft}
            onGenerateDraft={codexDraft.generateDraft}
          />
        )}
      </section>
    </AppStage>
  );
}
