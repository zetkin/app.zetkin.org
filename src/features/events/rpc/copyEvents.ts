import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinEvent } from 'utils/types/zetkin';

const paramsSchema = z.object({
  events: z.array(
    z.object({
      activity_id: z.union([z.optional(z.number()), z.null()]),
      campaign_id: z.optional(z.number()),
      cancelled: z.union([z.string(), z.null()]),
      contact_id: z.union([z.optional(z.number()), z.null()]),
      end_time: z.string(),
      info_text: z.optional(z.string()),
      location_id: z.union([z.optional(z.number()), z.null()]),
      num_participants_available: z.number(),
      num_participants_required: z.number(),
      organization_id: z.optional(z.number()),
      start_time: z.string(),
      title: z.optional(z.string()),
      url: z.optional(z.string()),
    })
  ),
  orgId: z.string(),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinEvent[];

export const copyEventsDef = {
  handler: handle,
  name: 'copyEvents',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(copyEventsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { events, orgId } = params;
  const createdEvents: ZetkinEvent[] = [];

  for (const event of events) {
    const { campaign_id, ...data } = event;
    const updatedEvent = await apiClient.post<ZetkinEvent>(
      `/api/orgs/${orgId}/${
        campaign_id ? `campaigns/${campaign_id}/` : ''
      }actions`,
      data
    );

    createdEvents.push(updatedEvent);
  }

  return createdEvents;
}
