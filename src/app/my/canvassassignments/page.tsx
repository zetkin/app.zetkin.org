import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import ProfilePage from 'features/areas/components/ProfilePage';
import { ZetkinOrganization } from 'utils/types/zetkin';

export default async function Page() {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    await apiClient.get<ZetkinOrganization>(`/api/users/me`);

    return <ProfilePage />;
  } catch (err) {
    return notFound();
  }
}
