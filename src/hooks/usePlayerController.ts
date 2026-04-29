import { useCallback, useEffect, useRef, useState } from 'react';
import type { Episode } from '../types';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function usePlayerController(episode: Episode) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveFrameRef = useRef<number | null>(null);
  const timelineFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(episode.songPreview);
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.volume = 0.26;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [episode.songPreview]);

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    analyserRef.current = null;
    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setTime(0);
  }, [episode.songPreview]);

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
  }, [episode.turns]);

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
  }, [episode.duration, isPlaying]);

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

  return {
    canvasRef,
    isPlaying,
    progress: Math.min(100, (time / episode.duration) * 100),
    seek: setTime,
    time,
    togglePlayback,
  };
}
