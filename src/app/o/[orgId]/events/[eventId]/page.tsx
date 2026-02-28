'use server';

import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import { PublicEventPage } from 'features/public/pages/PublicEventPage';

type Props = {
  params: Promise<{
    eventId: string;
    orgId: number;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const { eventId, orgId } = params;

  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const event = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${orgId}/actions/${eventId}`
  );

  return <PublicEventPage eventId={event.id} orgId={event.organization.id} />;
}
