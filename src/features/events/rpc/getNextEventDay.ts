import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import range from 'utils/range';
import { ZetkinEvent } from 'utils/types/zetkin';

const paramsSchema = z.object({
  afterDate: z.string(),
  campaignId: z.optional(z.number()),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = string | null;

export const getNextEventDayDef = {
  handler: handle,
  name: 'getNextEventDay',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getNextEventDayDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { afterDate: afterDateStr, campaignId, orgId } = params;

  const afterDate = new Date(afterDateStr);

  let eventCount = 0;
  let lastEventDate: Date | null = null;

  // Load (roughly) one month at a time, for up to a year
  // TODO: Get the first ever event to know how far to loop
  const offsets = range(12);
  for await (const diff of offsets) {
    const startDate = new Date(afterDate);
    const endDate = new Date(afterDate);

    // Jump forward 30 days
    endDate.setDate(startDate.getDate() + (diff + 1) * 30);
    startDate.setDate(endDate.getDate() + diff * 30);

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

    if (sorted.length) {
      lastEventDate = new Date(sorted[0].end_time);
    }

    eventCount += filtered.length;

    // Keep loading until we've found at least 10 events
    if (eventCount > 10) {
      break;
    }
  }

  return lastEventDate?.toISOString() ?? null;
}
