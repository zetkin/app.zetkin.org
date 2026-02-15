import { IncomingHttpHeaders } from 'http';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import icsFromEvents from 'features/events/utils/icsFromEvents';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string; orgId: string }> }
) {
  const headerList = await headers();

  const { orgId, eventId } = await params;

  // Convert ReadonlyHeaders to IncomingHttpHeaders
  const apiHeaders: IncomingHttpHeaders = {};
  for (const h in headerList.keys()) {
    apiHeaders[h] = headerList.get(h) as string;
  }

  const apiClient = new BackendApiClient(apiHeaders);

  const event = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${orgId}/actions/${eventId}`
  );

  const org = await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);

  return new Response(icsFromEvents(org.title, [event], org), {
    headers: { 'Content-Type': 'text/calendar' },
  });
}
