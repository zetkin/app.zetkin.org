import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import CanvassInstructionsPage from 'features/canvass/components/CanvassInstructionsPage';
import { ApiClientError } from 'core/api/errors';

interface PageProps {
  params: Promise<{
    areaAssId: number;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { areaAssId } = params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    await apiClient.get<ZetkinOrganization>(`/api/users/me`);

    return <CanvassInstructionsPage areaAssId={areaAssId} />;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) {
      return redirect(`/login?redirect=/canvass/${areaAssId}`);
    }
    throw err;
  }
}
