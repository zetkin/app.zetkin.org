import { cache } from 'react';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { getBrowserLanguage } from './locale';
import { ZetkinUser } from './types/zetkin';

/**
 * Memoized per request (React cache()), so App Router layouts nested under
 * RootLayout can each resolve the same user/lang without triggering a
 * duplicate /api/users/me request per layout.
 */
export const getRequestUser = cache(async (): Promise<ZetkinUser | null> => {
  const headersObject = Object.fromEntries(headers().entries());
  const apiClient = new BackendApiClient(headersObject);

  try {
    return await apiClient.get<ZetkinUser>('/api/users/me');
  } catch {
    return null;
  }
});

export const getRequestLang = cache(async (): Promise<string> => {
  const user = await getRequestUser();
  return (
    user?.lang || getBrowserLanguage(headers().get('accept-language') || '')
  );
});
