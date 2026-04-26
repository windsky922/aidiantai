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

