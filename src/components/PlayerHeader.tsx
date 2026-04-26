import type { RefObject } from 'react';

type PlayerHeaderProps = {
  host: string;
  isPlaying: boolean;
  clock: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export function PlayerHeader({ host, isPlaying, clock, canvasRef }: PlayerHeaderProps) {
  return (
    <header className="hero">
      <div className="host-row">
        <div className="host-mark" aria-hidden="true">
          C
        </div>
        <div>
          <h1>{host}</h1>
          <p>
            <span className={isPlaying ? 'live-dot live' : 'live-dot'} />
            {isPlaying ? 'Speaking...' : 'Ready'}
          </p>
        </div>
        <time>{clock}</time>
      </div>
      <canvas ref={canvasRef} className="wave" aria-label="Audio waveform" />
    </header>
  );
}

