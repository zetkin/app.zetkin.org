import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import BackendApiClient from 'core/api/client/BackendApiClient';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}
export default async function Page(props: PageProps) {
  const params = await props.params;
  await redirectIfLoginNeeded();

  const { token } = params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    await apiClient.put(`/api/users/me/verification_codes/${token}`);
  } catch (err) {
    redirect('/verify');
  }
  redirect('/my');
}
