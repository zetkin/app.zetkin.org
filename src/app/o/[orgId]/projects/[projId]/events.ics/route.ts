import { IncomingHttpHeaders } from 'http';
import dayjs from 'dayjs';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import {
  ZetkinCampaign,
  ZetkinEvent,
  ZetkinOrganization,
  ZetkinUser,
} from 'utils/types/zetkin';
import icsFromEvents from 'features/public/utils/icsFromEvents';
import { getBrowserLanguage } from 'utils/locale';

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

  let user: ZetkinUser | null;

  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  const lang =
    user?.lang || getBrowserLanguage(headers().get('accept-language') || '');

  const ics = await icsFromEvents(campaign.title, events, org, lang);

  return new Response(ics, {
    headers: { 'Content-Type': 'text/calendar' },
  });
}
