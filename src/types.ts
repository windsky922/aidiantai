export type Speaker = 'Claudio' | 'You';

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

