import { IncomingHttpHeaders } from 'http';
import dayjs from 'dayjs';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import {
  ZetkinProject,
  ZetkinEvent,
  ZetkinOrganization,
} from 'utils/types/zetkin';
import icsFromEvents from 'features/public/utils/icsFromEvents';

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
  const project = await apiClient.get<ZetkinProject>(
    `/api/orgs/${orgId}/campaigns/${projId}`
  );

  return new Response(icsFromEvents(project.title, events, org), {
    headers: { 'Content-Type': 'text/calendar' },
  });
}
