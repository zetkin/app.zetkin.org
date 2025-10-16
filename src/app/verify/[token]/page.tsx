import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import BackendApiClient from 'core/api/client/BackendApiClient';

interface PageProps {
  params: {
    code: string;
  };
}
export default async function Page({ params }: PageProps) {
  const { code } = params;
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    await apiClient.put(`/api/users/me/verification_codes`, { code });

    await redirectIfLoginNeeded();
    redirect('/my');
  } catch (err) {
    const path = headersList.get('x-requested-path');
    redirect(`/login?redirect=${path}`);
  }
}
