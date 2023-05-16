import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import range from 'utils/range';
import { ZetkinEvent } from 'utils/types/zetkin';

const paramsSchema = z.object({
  beforeDate: z.string(),
  campaignId: z.optional(z.number()),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = {
  date: string;
  events: ZetkinEvent[];
} | null;

export const getPrevEventDayDef = {
  handler: handle,
  name: 'getPrevEventDay',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getPrevEventDayDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { beforeDate: beforeDateStr, campaignId, orgId } = params;

  const beforeDate = new Date(beforeDateStr);

  // Load (roughly) one month at a time, for up to a year
  // TODO: Get the first ever event to know how far to loop
  const offsets = range(12);
  for await (const diff of offsets) {
    const startDate = new Date(beforeDate);
    const endDate = new Date(beforeDate);

    // Rewind 30 days
    startDate.setDate(startDate.getDate() - (diff + 1) * 30);
    endDate.setDate(endDate.getDate() - diff * 30);

    const startDateStr = startDate.toISOString().slice(0, 10);
    const endDateStr = endDate.toISOString().slice(0, 10);

    const events = await apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${orgId}/actions?filter=start_time>${startDateStr}&filter=end_time<${endDateStr}`
    );

    const filtered = events.filter(
      (event) => !campaignId || event.campaign?.id == campaignId
    );

    const sorted = filtered.sort(
      (e0, e1) =>
        new Date(e1.start_time).getTime() - new Date(e0.start_time).getTime()
    );
    const mostRecentEvent = sorted[0];

    if (mostRecentEvent) {
      const mostRecentDateStr = mostRecentEvent.start_time.slice(0, 10);
      const relevantEvents = filtered.filter(
        (event) => event.start_time.slice(0, 10) == mostRecentDateStr
      );

      return {
        date: mostRecentDateStr,
        events: relevantEvents,
      };
    }
  }

  return null;
}
