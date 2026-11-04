import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSession, ZetkinUser } from 'utils/types/zetkin';

const getUser = async (
  apiClient: BackendApiClient,
  redirectPath: string,
  requiredAuthLevel: number
) => {
  try {
    return await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (err) {
    redirect(
      `/login?redirect=${encodeURIComponent(redirectPath)}&level=${encodeURIComponent(requiredAuthLevel)}`
    );
  }
};

const getSession = async (
  apiClient: BackendApiClient,
  redirectPath: string,
  requiredAuthLevel: number
) => {
  try {
    return await apiClient.get<ZetkinSession>('/api/session');
  } catch (err) {
    redirect(
      `/login?redirect=${encodeURIComponent(redirectPath)}&level=${encodeURIComponent(requiredAuthLevel)}`
    );
  }
};

export default async function redirectIfLoginNeeded(
  config: { allowUnverified: boolean } = { allowUnverified: false },
  requiredAuthLevel: number = 1
) {
  const { allowUnverified } = config;

  const headersList = headers();
  const path = headersList.get('x-requested-path') || '';
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const redirectPath = path || '/';

  const session = await getSession(apiClient, redirectPath, requiredAuthLevel);
  if (session.level < requiredAuthLevel) {
    redirect(
      `/login?redirect=${encodeURIComponent(redirectPath)}&level=${encodeURIComponent(requiredAuthLevel)}`
    );
  }

  const user = await getUser(apiClient, redirectPath, requiredAuthLevel);
  if (!user.is_verified && !allowUnverified) {
    redirect('/verify');
  }

  return user;
}
