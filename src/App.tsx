import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import pilotEpisode from './data/pilotEpisode.json';
import type { Episode, Speaker, Turn } from './types';

const toSpeaker = (speaker: string): Speaker => (speaker === 'You' ? 'You' : 'Claudio');

const normalizeEpisode = (source: typeof pilotEpisode): Episode => ({
  ...source,
  turns: source.turns.map((turn) => ({
    ...turn,
    speaker: toSpeaker(turn.speaker),
  })),
});

const episode = normalizeEpisode(pilotEpisode);

const formatTime = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
};

const getTurnEnd = (turns: Turn[], index: number, total: number) =>
  turns[index + 1] ? turns[index + 1].start - 0.15 : total;

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [clock, setClock] = useState('');
  const [activeTab, setActiveTab] = useState<'player' | 'profile' | 'settings'>('player');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveFrameRef = useRef<number | null>(null);
  const timelineFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  const activeTurnIndex = useMemo(
    () =>
      episode.turns.findIndex((turn, index) => {
        const end = getTurnEnd(episode.turns, index, episode.duration);
        return time >= turn.start && time < end;
      }),
    [time],
  );

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    };
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const active = document.querySelector<HTMLDivElement>('[data-active-turn="true"]');
    if (active && transcriptRef.current) {
      transcriptRef.current.scrollTo({
        top: active.offsetTop - 20,
        behavior: 'smooth',
      });
    }
  }, [activeTurnIndex]);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(episode.songPreview);
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.volume = 0.26;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const ensureAnalyser = useCallback(() => {
    const audio = ensureAudio();
    if (analyserRef.current || !canvasRef.current) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try {
      const context = new AudioCtor();
      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      analyser.connect(context.destination);
      analyserRef.current = analyser;
      audioContextRef.current = context;
    } catch {
      analyserRef.current = null;
      audioContextRef.current = null;
    }
  }, [ensureAudio]);

  const speakIntro = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = episode.turns
      .filter((turn) => turn.speaker === 'Claudio' && turn.start < 18)
      .map((turn) => turn.text)
      .join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 0.82;
    utterance.volume = 0.86;
    window.speechSynthesis.speak(utterance);
  }, []);

  const drawWave = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * ratio;
    const height = canvas.clientHeight * ratio;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);
    const bars = 48;
    const gap = 5 * ratio;
    const barWidth = Math.max(2 * ratio, (width - gap * (bars - 1)) / bars);
    const data = new Uint8Array(analyserRef.current?.frequencyBinCount || 0);
    if (analyserRef.current) analyserRef.current.getByteFrequencyData(data);

    for (let i = 0; i < bars; i += 1) {
      const sampled = data.length ? data[(i * 2) % data.length] / 255 : 0;
      const idle = Math.sin(Date.now() / 520 + i * 0.62) * 0.5 + 0.5;
      const energy = isPlaying ? Math.max(sampled, idle * 0.32) : idle * 0.18;
      const barHeight = Math.max(8 * ratio, energy * height * 0.88);
      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, 'rgba(255,255,255,0.92)');
      gradient.addColorStop(1, 'rgba(165, 185, 255, 0.42)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 999);
      ctx.fill();
    }

    waveFrameRef.current = window.requestAnimationFrame(drawWave);
  }, [isPlaying]);

  useEffect(() => {
    waveFrameRef.current = window.requestAnimationFrame(drawWave);
    return () => {
      if (waveFrameRef.current) window.cancelAnimationFrame(waveFrameRef.current);
    };
  }, [drawWave]);

  useEffect(() => {
    if (!isPlaying) return;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = (now - previous) / 1000;
      previous = now;
      setTime((current) => {
        const next = current + delta;
        return next >= episode.duration ? 0 : next;
      });
      timelineFrameRef.current = window.requestAnimationFrame(tick);
    };
    timelineFrameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (timelineFrameRef.current) window.cancelAnimationFrame(timelineFrameRef.current);
    };
  }, [isPlaying]);

  const togglePlayback = async () => {
    ensureAnalyser();
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    const audio = ensureAudio();
    if (isPlaying) {
      audio.pause();
      window.speechSynthesis?.pause();
      setIsPlaying(false);
      return;
    }
    if (time < 0.2) speakIntro();
    await audio.play().catch(() => undefined);
    window.speechSynthesis?.resume();
    setIsPlaying(true);
  };

  const seek = (value: number) => {
    setTime(value);
  };

  const progress = Math.min(100, (time / episode.duration) * 100);

  return (
    <main className="stage">
      <div className="fluid fluid-blue" />
      <div className="fluid fluid-violet" />
      <div className="fluid fluid-rose" />
      <div className="noise" />

      <section className="device" aria-label="Claudio FM player">
        <nav className="tabs" aria-label="Views">
          {(['player', 'profile', 'settings'] as const).map((tab) => (
            <button
              className={activeTab === tab ? 'tab active' : 'tab'}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </nav>

        <header className="hero">
          <div className="host-row">
            <div className="host-mark" aria-hidden="true">
              C
            </div>
            <div>
              <h1>{episode.host}</h1>
              <p>
                <span className={isPlaying ? 'live-dot live' : 'live-dot'} />
                {isPlaying ? 'Speaking...' : 'Ready'}
              </p>
            </div>
            <time>{clock}</time>
          </div>
          <canvas ref={canvasRef} className="wave" aria-label="Audio waveform" />
        </header>

        {activeTab === 'player' && (
          <section className="panel player-panel">
            <div className="episode-meta">
              <div>
                <p className="eyebrow">mmguo style demo</p>
                <h2>{episode.title}</h2>
                <p>{episode.subtitle}</p>
              </div>
              <button className="play-button" onClick={togglePlayback} type="button" aria-label="Play or pause">
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>

            <div className="trackline" aria-label="Playback progress">
              <span>{formatTime(time)}</span>
              <input
                aria-label="Seek"
                max={episode.duration}
                min={0}
                onChange={(event) => seek(Number(event.target.value))}
                step={0.1}
                type="range"
                value={time}
                style={{ '--progress': `${progress}%` } as React.CSSProperties}
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
        )}

        {activeTab === 'profile' && (
          <section className="panel info-panel">
            <p className="eyebrow">context model</p>
            <h2>Personal radio memory</h2>
            <ul>
              <li>taste.md: long-term taste, favorite years, disliked sounds.</li>
              <li>routines.md: work rhythm, sleep windows, focus periods.</li>
              <li>playlists.json: song library, playlist source, years, tags.</li>
              <li>mood-rules.md: weather, time, and mood matching rules.</li>
            </ul>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="panel info-panel">
            <p className="eyebrow">next integrations</p>
            <h2>Local service hooks</h2>
            <ul>
              <li>Claude generates episode JSON and DJ copy.</li>
              <li>Fish Audio converts DJ copy into cached speech.</li>
              <li>Netease API resolves songs, lyrics, and recommendations.</li>
              <li>WebSocket streams now-playing state into this player.</li>
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
