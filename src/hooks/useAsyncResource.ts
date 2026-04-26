import { useEffect, useState } from 'react';
import type { Resource } from '../lib/api';
import { getErrorMessage } from '../lib/api';

export function useAsyncResource<T>(load: () => Promise<T>, fallbackError: string) {
  const [resource, setResource] = useState<Resource<T>>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const data = await load();
        if (!cancelled) setResource({ status: 'ready', data });
      } catch (error) {
        if (!cancelled) {
          setResource({
            status: 'error',
            error: getErrorMessage(error, fallbackError),
          });
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [fallbackError, load]);

  return resource;
}

