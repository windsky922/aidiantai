import { useCallback, useState } from 'react';
import { API_ENDPOINTS } from '../config';
import { getErrorMessage, postJson } from '../lib/api';
import type { ActionResource } from '../lib/api';
import type { CodexDraft } from '../types';

export function useCodexDraft() {
  const [draft, setDraft] = useState<ActionResource<CodexDraft>>({ status: 'idle' });

  const generateDraft = useCallback(async () => {
    setDraft({ status: 'loading' });

    try {
      setDraft({
        status: 'ready',
        data: await postJson<CodexDraft>(API_ENDPOINTS.codexDraft),
      });
    } catch (error) {
      setDraft({
        status: 'error',
        error: getErrorMessage(error, 'Unable to generate Codex draft.'),
      });
    }
  }, []);

  return {
    draft,
    generateDraft,
  };
}
