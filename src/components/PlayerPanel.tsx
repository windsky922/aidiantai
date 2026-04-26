import type { CSSProperties, RefObject } from 'react';
import type { Episode } from '../types';
import { formatTime, getTurnEnd } from '../lib/time';

type PlayerPanelProps = {
  episode: Episode;
  isPlaying: boolean;
  time: number;
  progress: number;
  transcriptRef: RefObject<HTMLDivElement | null>;
  onSeek: (value: number) => void;
  onTogglePlayback: () => void;
};

export function PlayerPanel({
  episode,
  isPlaying,
  time,
  progress,
  transcriptRef,
  onSeek,
  onTogglePlayback,
}: PlayerPanelProps) {
  return (
    <section className="panel player-panel">
      <div className="episode-meta">
        <div>
          <p className="eyebrow">mmguo style demo</p>
          <h2>{episode.title}</h2>
          <p>{episode.subtitle}</p>
        </div>
        <button className="play-button" onClick={onTogglePlayback} type="button" aria-label="Play or pause">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="trackline" aria-label="Playback progress">
        <span>{formatTime(time)}</span>
        <input
          aria-label="Seek"
          max={episode.duration}
          min={0}
          onChange={(event) => onSeek(Number(event.target.value))}
          step={0.1}
          type="range"
          value={time}
          style={{ '--progress': `${progress}%` } as CSSProperties}
        />
        <span>{formatTime(episode.duration)}</span>
      </div>

      <div className="transcript" ref={transcriptRef}>
        {episode.turns.map((turn, index) => {
          const end = getTurnEnd(episode.turns, index, episode.duration);
          const active = time >= turn.start && time < end;
          const past = time >= end;
          return (
            <article
              className={`turn ${active ? 'active' : ''} ${past ? 'past' : ''}`}
              data-active-turn={active}
              key={`${turn.speaker}-${turn.start}`}
            >
              <div>
                <strong>{turn.speaker}</strong>
                <span>{formatTime(turn.start)}</span>
              </div>
              <p>{turn.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

