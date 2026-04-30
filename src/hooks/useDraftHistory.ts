import { useCallback, useState } from 'react';
import type { CodexDraft } from '../types';

const STORAGE_KEY = 'codex-draft-history:v1';
const MAX_HISTORY_ITEMS = 5;

const isDraftHistory = (value: unknown): value is CodexDraft[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      'generatedAt' in item &&
      'preview' in item &&
      'provider' in item,
  );

const readDraftHistory = () => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return isDraftHistory(parsed) ? parsed.slice(0, MAX_HISTORY_ITEMS) : [];
  } catch {
    return [];
  }
};

const writeDraftHistory = (items: CodexDraft[]) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // 历史保存失败不应影响当前草稿生成和应用流程。
  }
};

export function useDraftHistory() {
  const [items, setItems] = useState<CodexDraft[]>(readDraftHistory);

  const saveDraft = useCallback((draft: CodexDraft) => {
    if (!draft.preview.ok) return;

    setItems((currentItems) => {
      const nextItems = [
        draft,
        ...currentItems.filter((item) => item.generatedAt !== draft.generatedAt),
      ].slice(0, MAX_HISTORY_ITEMS);
      writeDraftHistory(nextItems);
      return nextItems;
    });
  }, []);

  return {
    draftHistory: items,
    saveDraft,
  };
}
