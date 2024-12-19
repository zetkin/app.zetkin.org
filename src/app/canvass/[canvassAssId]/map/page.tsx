import 'leaflet/dist/leaflet.css';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import MyCanvassAssignmentPage from 'features/canvassAssignments/components/MyCanvassAssignmentPage';

interface PageProps {
  params: {
    canvassAssId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { canvassAssId } = params;
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    await apiClient.get<ZetkinOrganization>(`/api/users/me`);

    return <MyCanvassAssignmentPage canvassAssId={canvassAssId} />;
  } catch (err) {
    return redirect(`/login?redirect=/canvass/${canvassAssId}/map`);
  }
}
