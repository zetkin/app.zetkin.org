import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSession } from 'utils/types/zetkin';

export default async function redirectIfLoginNeeded(
  requiredAuthLevel: number = 1
) {
  const headersList = headers();
  const path = headersList.get('x-requested-path') || '';

  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  // First check if user is logged in with sufficient auth level
  try {
    const session = await apiClient.get<ZetkinSession>('/api/session');
    if (session.level < requiredAuthLevel) {
      const redirectPath = path || '/';
      redirect(`/login?redirect=${redirectPath}`);
    }
  } catch (err) {
    const redirectPath = path || '/';
    redirect(`/login?redirect=${redirectPath}`);
  }

  // Then check if user is verified (but don't redirect if we're already on verify page)
  try {
    const user = await apiClient.get<ZetkinUser>('/api/users/me');
    if (!user.is_verified && !path.startsWith('/verify')) {
      redirect(`/verify`);
    }
  } catch (err) {
    // User fetch failed, redirect to login
    const redirectPath = path || '/';
    redirect(`/login?redirect=${redirectPath}`);
  }
}
