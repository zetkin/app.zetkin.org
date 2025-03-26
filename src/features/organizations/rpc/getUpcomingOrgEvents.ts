import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinEvent } from 'utils/types/zetkin';
import IApiClient from 'core/api/client/IApiClient';
import getEventState from '../../events/utils/getEventState';
import { EventState } from '../../events/hooks/useEventState';

const paramsSchema = z.object({ orgId: z.union([z.number(), z.string()]) });

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinEvent[];

export const getUpcomingOrgEventsDef = {
  handler: handle,
  name: 'getUpcomingOrgEvents',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getUpcomingOrgEventsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId } = params;

  const now = new Date().toISOString();

  const events = await apiClient.get<ZetkinEvent[]>(
    `/api/orgs/${orgId}/actions?recursive&filter=start_time%3E=${now}`
  );

  return events.filter((event) => {
    const state = getEventState(event);
    return state == EventState.OPEN || state == EventState.SCHEDULED;
  });
}
