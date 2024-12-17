import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSession } from 'utils/types/zetkin';

export default async function redirectIfLoginNeeded(
  requiredAuthLevel: number = 1
) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  let shouldRedirectToLogin = false;

  try {
    const session = await apiClient.get<ZetkinSession>('/api/session');
    if (session.level < requiredAuthLevel) {
      shouldRedirectToLogin = true;
    }
  } catch (err) {
    shouldRedirectToLogin = true;
  }

  if (shouldRedirectToLogin) {
    const path = headersList.get('x-requested-path');
    redirect(`/login?redirect=${path}`);
  }
}
