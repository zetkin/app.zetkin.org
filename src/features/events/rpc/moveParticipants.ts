import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';

const paramsSchema = z.object({
  ops: z.array(
    z.object({
      eventId: z.number(),
      kind: z.enum(['add', 'remove']),
      personId: z.number(),
    })
  ),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;

export const moveParticipantsDef = {
  handler: handle,
  name: 'moveParticipants',
  schema: paramsSchema,
};

export default makeRPCDef<Params, void>(moveParticipantsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<void> {
  const { ops, orgId } = params;

  for (const op of ops) {
    const { eventId, kind, personId } = op;
    try {
      if (kind == 'add') {
        await apiClient.put(
          `/api/orgs/${orgId}/actions/${eventId}/participants/${personId}`
        );
      } else {
        await apiClient.delete(
          `/api/orgs/${orgId}/actions/${eventId}/participants/${personId}`
        );
      }
    } catch (err) {
      // Just ignore
    }
  }
}
