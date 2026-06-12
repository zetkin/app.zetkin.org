import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';

const paramsSchema = z.object({
  eventId: z.number(),
});

type Params = z.input<typeof paramsSchema>;

export const findEventByIdDef = {
  handler: handle,
  name: 'findEventById',
  schema: paramsSchema,
};

export default makeRPCDef<Params, ZetkinEvent | null>(findEventByIdDef.name);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<ZetkinEvent | null> {
  const { eventId } = params;

  const orgs = await apiClient.get<ZetkinOrganization[]>(`/api/orgs`);

  const eventsPerOrg = await Promise.all(
    orgs.map((org) =>
      apiClient
        .get<ZetkinEvent>(`/api/orgs/${org.id}/actions/${eventId}`)
        .catch(() => null)
    )
  );

  return eventsPerOrg.find((ev) => !!ev) || null;
}
