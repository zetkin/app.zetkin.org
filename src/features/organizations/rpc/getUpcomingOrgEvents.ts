import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
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
  const campaigns = await apiClient.get<ZetkinCampaign[]>(
    `/api/orgs/${orgId}/campaigns?recursive`
  );

  const now = new Date().toISOString();

  const events: ZetkinEvent[] = [];
  for (const campaign of campaigns) {
    const eventsOfOrg = await apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${campaign.organization.id}/campaigns/${campaign.id}/actions?filter=start_time%3E=${now}`
    );
    events.push(...eventsOfOrg);
  }

  return events.filter((event) => {
    const state = getEventState(event);
    return state == EventState.OPEN || state == EventState.SCHEDULED;
  });
}
