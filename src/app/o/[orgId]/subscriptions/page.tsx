import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import SubscriptionsManagementPage from 'features/public/pages/SubscriptionsManagementPage';
import { EmailChannel } from 'features/public/types';
import SubscriptionsTokenRequestPage from 'features/public/pages/SubscriptionsTokenRequestPage';
import { initialData } from 'features/public/hooks/useEmailChannels';
import { EmailToken } from 'features/public/types';
import requiredEnvVar from 'utils/requiredEnvVar';
import { stringToBool } from 'utils/stringUtils';

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
  const token = searchParams.token;
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  let org: ZetkinOrganization | null = null;
  try {
    org = await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);
  } catch {
    return notFound();
  }

  if (!token) {
    return <SubscriptionsTokenRequestPage org={org} />;
  }

  try {
    const decodedToken = jwtDecode<EmailToken>(token);
    const tokenExpiry = decodedToken.exp;
    const isExpired = !tokenExpiry || tokenExpiry < new Date().getTime() / 1000;

    if (isExpired) {
      return <SubscriptionsTokenRequestPage org={org} />;
    }

    const host = requiredEnvVar('ZETKIN_API_HOST');
    const port = process.env.ZETKIN_API_PORT;
    const ssl = stringToBool(process.env.ZETKIN_USE_TLS);

    const protocol = ssl ? 'https' : 'http';
    const hostAndPort = host + (port ? `:${port}` : '');
    const apiBase = `${protocol}://${hostAndPort}/v2/`;

    // Fetch channels and render subscription management page
    const channelsReq = await fetch(`${apiBase}/orgs/${orgId}/channels`, {
      // What exactly should url be.
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    });
    if (!channelsReq.ok) {
      throw new Error('Channels fetch failed');
    }
    const initialChannels: EmailChannel[] = await channelsReq.json();
    initialChannels.toLocaleString();
    return (
      <SubscriptionsManagementPage
        email={decodedToken.email}
        initialChannels={initialData}
        org={org}
        token={token}
      />
    );
  } catch {
    return <SubscriptionsTokenRequestPage org={org} />;
  }
}
