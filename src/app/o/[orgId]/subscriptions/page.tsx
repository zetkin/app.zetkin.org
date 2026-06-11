import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import SubscriptionsManagementPage from 'features/public/pages/SubscriptionsManagementPage';

type PageProps = {
  params: {
    orgId: string;
  };
  searchParams: {
    jwt?: string;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const jwt = searchParams.jwt;
  //const validJwt = jwt.isValid();

  /*  if (!jwt || !validJwt) {
    return notFound();
  } */

  try {
    const org = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${params.orgId}`
    );

    return <SubscriptionsManagementPage org={org} />;
  } catch (err) {
    return notFound();
  }
}
