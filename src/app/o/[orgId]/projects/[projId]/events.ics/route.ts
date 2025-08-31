import { IncomingHttpHeaders } from 'http';
import dayjs from 'dayjs';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import icsFromEvents from 'features/events/utils/icsFromEvents';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orgId: string; projId: string }> }
) {
  const headerList = await headers();

  const { orgId, projId } = await params;

  // Convert ReadonlyHeaders to IncomingHttpHeaders
  const apiHeaders: IncomingHttpHeaders = headerList.keys().reduce((hs, h) => {
    hs[h] = headerList.get(h) as string;
    return hs;
  }, {} as IncomingHttpHeaders);

  const apiClient = new BackendApiClient(apiHeaders);

  const startTime = dayjs()
    .subtract(2, 'month')
    .toDate()
    .toISOString()
    .slice(0, 10);

  const events = await apiClient.get<ZetkinEvent[]>(
    `/api/orgs/${orgId}/campaigns/${projId}/actions?filter=start_time>=${startTime}`
  );

  const org = await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);

  return new Response(icsFromEvents(events, org), {
    headers: { 'Content-Type': 'text/calendar' },
  });
}
