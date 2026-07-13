import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import CanvassPage from 'features/canvass/components/CanvassPage';
import { ApiClientError } from 'core/api/errors';

interface PageProps {
  params: {
    areaAssId: number;
    areaId: number;
  };
}

export default async function Page({ params }: PageProps) {
  const { areaAssId, areaId } = params;
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    await apiClient.get<ZetkinOrganization>(`/api/users/me`);

    return <CanvassPage areaAssId={areaAssId} areaId={areaId} />;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) {
      return redirect(`/login?redirect=/canvass/${areaAssId}/areas/${areaId}`);
    }
    throw err;
  }
}
