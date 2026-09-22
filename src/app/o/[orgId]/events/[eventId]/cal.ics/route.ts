import { IncomingHttpHeaders } from 'http';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import {
  ZetkinEvent,
  ZetkinOrganization,
  ZetkinUser,
} from 'utils/types/zetkin';
import icsFromEvents from 'features/public/utils/icsFromEvents';
import { getBrowserLanguage } from 'utils/locale';

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

  let user: ZetkinUser | null;

  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  const lang =
    user?.lang || getBrowserLanguage(headers().get('accept-language') || '');

  const ics = await icsFromEvents(org.title, [event], org, lang);

  return new Response(ics, {
    headers: { 'Content-Type': 'text/calendar' },
  });
}
