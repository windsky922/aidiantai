import type { RadioContext, TabId } from '../types';

type InfoPanelProps = {
  activeTab: Exclude<TabId, 'player'>;
  radioContext: RadioContext | null;
  contextError: string | null;
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

const contextItems = (radioContext: RadioContext | null, contextError: string | null) => {
  if (contextError) return [`Context API error: ${contextError}`];
  if (!radioContext) return ['Loading local context from /api/context.'];

  const yearRange = radioContext.summary.yearRange
    ? `${radioContext.summary.yearRange[0]}-${radioContext.summary.yearRange[1]}`
    : 'No year range yet';

  return [
    `${radioContext.summary.songCount} songs across ${radioContext.summary.artistCount} artists.`,
    `Year range: ${yearRange}.`,
    `Moods: ${radioContext.summary.moods.join(', ') || 'No moods yet'}.`,
    `Scenes: ${radioContext.summary.scenes.join(', ') || 'No scenes yet'}.`,
  ];
};

export function InfoPanel({ activeTab, radioContext, contextError }: InfoPanelProps) {
  const content = copy[activeTab];
  const items = activeTab === 'profile' ? contextItems(radioContext, contextError) : content.items;

  return (
    <section className="panel info-panel">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
