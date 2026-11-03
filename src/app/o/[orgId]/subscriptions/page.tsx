import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization, ZetkinUser } from 'utils/types/zetkin';
import SubscriptionsManagementPage from 'features/public/pages/SubscriptionsManagementPage';
import SubscriptionsTokenRequestPage from 'features/public/pages/SubscriptionsTokenRequestPage';
import { AppSession } from 'utils/types';
import requiredEnvVar from 'utils/requiredEnvVar';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { orgId } = params;
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  let user: ZetkinUser | null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
    const cookieStore = cookies();
    const session = await getIronSession<AppSession>(cookieStore, {
      cookieName: 'zsid',
      password: requiredEnvVar('SESSION_PASSWORD'),
    });
    if (session.tokenData) {
      return redirect(`/logout?redir=/o/${orgId}/subscriptions`);
    }
  }

  let org: ZetkinOrganization | null = null;
  try {
    org = await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);
  } catch {
    return notFound();
  }

  if (!user) {
    return <SubscriptionsTokenRequestPage org={org} />;
  }

  return (
    <SubscriptionsManagementPage
      email={user.email}
      initialChannels={[
        {
          id: 234,
          is_blocked: false,
          published: '20250212',
          published_by_user_id: 1231,
          sender_email: 'cutest@cat.com',
          sender_name: 'Catttt',
          title: 'Cat channel',
        },
      ]}
      org={org}
    />
  );
}
