import { z } from 'zod';

import { EventStats } from '../store';
import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';

const paramsSchema = z.object({
  eventId: z.number(),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = EventStats;

export const getEventStatsDef = {
  handler: handle,
  name: 'getEventStats',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getEventStatsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { eventId, orgId } = params;

  const stats = await apiClient.get<{
    num_booked: number;
    num_pending: number;
    num_reminded: number;
    num_signups: number;
  }>(`/api/orgs/${orgId}/actions/${eventId}/stats`);

  return {
    id: eventId,
    numBooked: stats.num_booked,
    numPending: stats.num_pending,
    numReminded: stats.num_reminded,
    numSignups: stats.num_signups,
  };
}
