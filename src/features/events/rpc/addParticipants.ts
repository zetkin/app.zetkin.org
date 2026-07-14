import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinEventParticipant } from 'utils/types/zetkin';

const paramsSchema = z.object({
  eventId: z.number(),
  orgId: z.number(),
  participantIds: z.array(z.number()),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinEventParticipant[];

export const addParticipantsDef = {
  handler: handle,
  name: 'addParticipants',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(addParticipantsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { eventId, orgId, participantIds } = params;

  const participants: ZetkinEventParticipant[] = [];

  for (const id of participantIds) {
    try {
      const participant = await apiClient.put<ZetkinEventParticipant>(
        `/api/orgs/${orgId}/actions/${eventId}/participants/${id}`,
        {}
      );
      participants.push(participant);
    } catch (err) {
      // Just ignore
    }
  }
  return participants;
}
