import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import SubscriptionsManagementPage from 'features/public/pages/SubscriptionsManagementPage';
import { EmailChannel } from 'features/public/types';
import SubscriptionsTokenRequestPage from 'features/public/pages/SubscriptionsTokenRequestPage';

type PageProps = {
  params: {
    orgId: string;
  };
  searchParams: {
    token?: string;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const { orgId } = params;
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const token = searchParams.token;

  if (!token) {
    //TODO: redirect to page to input email for new jwt
    return <SubscriptionsTokenRequestPage />;
  } else {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp;
      const now = new Date();
      const isExpired = !expirationTime || expirationTime < now.getTime();

      if (isExpired) {
        return <SubscriptionsTokenRequestPage />;
      } else {
        try {
          const org = await apiClient.get<ZetkinOrganization>(
            `/api/orgs/${orgId}`
          );

          const channelsReq = await fetch(`/api2/orgs/${orgId}/channels`, {
            // What exactly should url be.
            headers: new Headers({ Authorization: `Bearer ${token}` }),
          });
          if (!channelsReq.ok) {
            throw new Error('Channels fetch failed');
          }
          const initialChannels: EmailChannel[] = await channelsReq.json();
          return (
            <SubscriptionsManagementPage
              initialChannels={initialChannels}
              org={org}
              token={token}
            />
          );
        } catch (err) {
          return notFound();
        }
      }
    } catch {
      //TODO: redirect to page to input email for new jwt
    }
  }
}
