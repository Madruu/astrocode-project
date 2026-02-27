const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export const API_BASE_URL =
  (globalThis as { __ASTROCODE_API_BASE_URL__?: string }).__ASTROCODE_API_BASE_URL__ ??
  DEFAULT_API_BASE_URL;

export function buildApiUrl(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error('API path must start with "/"');
  }

  return `${API_BASE_URL}${path}`;
}
