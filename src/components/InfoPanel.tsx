import type { TabId } from '../types';

type InfoPanelProps = {
  activeTab: Exclude<TabId, 'player'>;
};

const copy = {
  profile: {
    eyebrow: 'context model',
    title: 'Personal radio memory',
    items: [
      'taste.md: long-term taste, favorite years, disliked sounds.',
      'routines.md: work rhythm, sleep windows, focus periods.',
      'playlists.json: song library, playlist source, years, tags.',
      'mood-rules.md: weather, time, and mood matching rules.',
    ],
  },
  settings: {
    eyebrow: 'next integrations',
    title: 'Local service hooks',
    items: [
      'Codex generates episode JSON and DJ copy.',
      'Fish Audio converts DJ copy into cached speech.',
      'Netease API resolves songs, lyrics, and recommendations.',
      'WebSocket streams now-playing state into this player.',
    ],
  },
};

export function InfoPanel({ activeTab }: InfoPanelProps) {
  const content = copy[activeTab];

  return (
    <section className="panel info-panel">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.title}</h2>
      <ul>
        {content.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
