import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinEvent, ZetkinMembership } from 'utils/types/zetkin';
import IApiClient from 'core/api/client/IApiClient';

const paramsSchema = z.object({});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinEvent[];

export const getAllEventsDef = {
  handler: handle,
  name: 'getAllEvents',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getAllEventsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const memberships = await apiClient.get<ZetkinMembership[]>(
    '/api/users/me/memberships'
  );

  const now = new Date().toISOString();

  const events: ZetkinEvent[] = [];
  for (const membership of memberships) {
    const eventsOfOrg = await apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${membership.organization.id}/actions?filter=start_time%3E=${now}`
    );
    events.push(...eventsOfOrg);
  }

  return events;
}
