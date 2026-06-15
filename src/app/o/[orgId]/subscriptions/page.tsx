import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import SubscriptionsManagementPage from 'features/public/pages/SubscriptionsManagementPage';

type PageProps = {
  params: {
    orgId: string;
  };
  searchParams: {
    token?: string;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const token = searchParams.token;

  if (!token) {
    //TODO: redirect to page to input email for new jwt
  } else {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp;
      const now = new Date();
      const isExpired = !expirationTime || expirationTime < now.getTime();

      if (isExpired) {
        //TODO: redirect to page to input email for new jwt
      } else {
        try {
          const org = await apiClient.get<ZetkinOrganization>(
            `/api/orgs/${params.orgId}`
          );

          //const channels = await apiClient.get<ZetkinEmailChannel[]>(`/api/WHATEVERURL`)

          return <SubscriptionsManagementPage org={org} token={token} />;
        } catch (err) {
          //Could not find org, so we 404
          return notFound();
        }
      }
    } catch {
      //TODO: redirect to page to input email for new jwt
    }
  }
}
