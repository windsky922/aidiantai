export type Speaker = 'Claudio' | 'You';

export type TabId = 'player' | 'profile' | 'settings';

export type Turn = {
  speaker: Speaker;
  start: number;
  text: string;
};

export type Episode = {
  host: string;
  title: string;
  subtitle: string;
  duration: number;
  songPreview: string;
  turns: Turn[];
};

export type EpisodeResult =
  | {
      ok: true;
      episode: Episode;
    }
  | {
      ok: false;
      error: string;
    };

export type ContextSummary = {
  songCount: number;
  artistCount: number;
  yearRange: [number, number] | null;
  moods: string[];
  scenes: string[];
};

export type RadioContext = {
  taste: string;
  routines: string;
  moodRules: string;
  playlists: unknown[];
  summary: ContextSummary;
};

export type CodexPromptSummary = {
  target: string;
  task: string;
  instructionCount: number;
  candidateSongCount: number;
  playlistSummary: ContextSummary;
  outputKeys: string[];
};

