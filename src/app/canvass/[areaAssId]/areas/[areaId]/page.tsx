import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import CanvassPage from 'features/canvass/components/CanvassPage';

interface PageProps {
  params: Promise<{
    areaAssId: number;
    areaId: number;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { areaAssId, areaId } = params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    await apiClient.get<ZetkinOrganization>(`/api/users/me`);

    return <CanvassPage areaAssId={areaAssId} areaId={areaId} />;
  } catch (err) {
    return redirect(`/login?redirect=/canvass/${areaAssId}/areas/${areaId}`);
  }
}
