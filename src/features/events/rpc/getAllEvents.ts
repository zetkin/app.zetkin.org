import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinEvent, ZetkinMembership } from 'utils/types/zetkin';
import IApiClient from 'core/api/client/IApiClient';
import getEventState from '../utils/getEventState';
import { EventState } from '../hooks/useEventState';

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
  const memberships = await apiClient
    .get<ZetkinMembership[]>('/api/users/me/memberships')
    .then((memberships) =>
      memberships.filter((membership) => membership.follow)
    );

  const now = new Date().toISOString();

  return await Promise.all(
    memberships.map((membership) =>
      apiClient
        .get<ZetkinEvent[]>(
          `/api/orgs/${membership.organization.id}/actions?filter=start_time%3E=${now}`
        )
        .then((events) =>
          events.filter((event) => eventStates.includes(getEventState(event)))
        )
    )
  ).then((eventsByOrg) => eventsByOrg.flat());
}

const eventStates = [EventState.OPEN, EventState.SCHEDULED];
