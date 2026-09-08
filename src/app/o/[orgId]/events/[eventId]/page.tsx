'use server';

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import { PublicEventPage } from 'features/public/pages/PublicEventPage';
import { ApiClientError } from 'core/api/errors';
import prefetchResource from 'core/resources/prefetchResource';
import { ResourceProvider } from 'core/resources/ResourceProvider';
import myEventsResource from 'features/my/resources/myEventsResource';

type Props = {
  params: {
    eventId: string;
    orgId: number;
  };
};

export default async function Page({ params: { eventId, orgId } }: Props) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);
  const today = new Date().toISOString().slice(0, 10);
  const myEvents = prefetchResource(apiClient, myEventsResource, { today });

  const privacyUrl =
    process.env.ZETKIN_PRIVACY_POLICY_LINK || 'https://zetkin.org/privacy';

  try {
    const event = await apiClient.get<ZetkinEvent>(
      `/api/orgs/${orgId}/actions/${eventId}`
    );

    return (
      <ResourceProvider resources={[myEvents]}>
        <PublicEventPage
          eventId={event.id}
          orgId={event.organization.id}
          privacyUrl={privacyUrl}
        />
      </ResourceProvider>
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    }
    throw e;
  }
}
