export type Resource<T> =
  | {
      status: 'loading';
    }
  | {
      status: 'ready';
      data: T;
    }
  | {
      status: 'error';
      error: string;
    };

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return (await response.json()) as T;
}

export const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

