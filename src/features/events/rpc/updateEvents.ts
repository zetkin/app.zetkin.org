import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinEvent } from 'utils/types/zetkin';

const paramsSchema = z.object({
  data: z.object({
    cancelled: z.string().nullable().optional(),
    published: z.string().nullable().optional(),
  }),
  events: z.array(z.number()),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = {
  updatedEvents: ZetkinEvent[];
};

export const updateEventsDef = {
  handler: handle,
  name: 'updateEvents',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(updateEventsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId, events, data } = params;
  const updatedEvents: ZetkinEvent[] = [];

  for (const eventId of events) {
    await apiClient
      .patch<ZetkinEvent>(`/api/orgs/${orgId}/actions/${eventId}`, data)
      .then((event) => {
        updatedEvents.push(event);
      });
  }

  return {
    updatedEvents,
  };
}
