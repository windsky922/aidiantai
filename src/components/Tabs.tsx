import type { TabId } from '../types';

type TabsProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

const tabs: TabId[] = ['player', 'profile', 'settings'];

export function Tabs({ activeTab, onChange }: TabsProps) {
  return (
    <nav className="tabs" aria-label="Views">
      {tabs.map((tab) => (
        <button className={activeTab === tab ? 'tab active' : 'tab'} key={tab} onClick={() => onChange(tab)} type="button">
          {tab}
        </button>
      ))}
    </nav>
  );
}

