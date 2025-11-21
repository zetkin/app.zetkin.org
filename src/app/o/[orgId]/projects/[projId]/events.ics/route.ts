import { IncomingHttpHeaders } from 'http';
import dayjs from 'dayjs';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import {
  ZetkinCampaign,
  ZetkinEvent,
  ZetkinOrganization,
} from 'utils/types/zetkin';
import icsFromEvents from 'features/events/utils/icsFromEvents';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orgId: string; projId: string }> }
) {
  const headerList = await headers();

  const { orgId, projId } = await params;

  // Convert ReadonlyHeaders to IncomingHttpHeaders
  const apiHeaders: IncomingHttpHeaders = {};
  for (const h in headerList.keys()) {
    apiHeaders[h] = headerList.get(h) as string;
  }

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
  const campaign = await apiClient.get<ZetkinCampaign>(
    `/api/orgs/${orgId}/campaigns/${projId}`
  );

  return new Response(icsFromEvents(campaign.title, events, org), {
    headers: { 'Content-Type': 'text/calendar' },
  });
}
