'use server';

import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { PublicEventPage } from 'features/organizations/pages/PublicEventPage';

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

  const org = await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);
  return <PublicEventPage eventId={parseInt(eventId)} org={org} />;
}
