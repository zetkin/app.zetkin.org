import { z } from 'zod';

import { EventStats } from '../store';
import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

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
  const participants = await apiClient.get<ZetkinEventParticipant[]>(
    `/api/orgs/${orgId}/actions/${eventId}/participants`
  );
  const signups = await apiClient.get<ZetkinEventResponse[]>(
    `/api/orgs/${orgId}/actions/${eventId}/responses`
  );

  return {
    id: eventId,
    numBooked: participants.length,
    numPending: signups.filter((s) => !participants.some((p) => p.id == s.id))
      .length,
    numReminded: participants.filter((p) => !!p.reminder_sent).length,
    numSignups: signups.length,
  };
}
