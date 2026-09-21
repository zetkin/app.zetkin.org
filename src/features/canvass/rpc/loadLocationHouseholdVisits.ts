import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinHouseholdVisit } from 'features/canvass/types';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

const paramsSchema = z.object({
  assignmentId: z.number(),
  locationId: z.number(),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = {
  visits: ZetkinHouseholdVisit[];
};

export const loadLocationHouseholdVisitsDef = {
  handler: handle,
  name: 'loadLocationHouseholdVisits',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(loadLocationHouseholdVisitsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { assignmentId, locationId, orgId } = params;

  const visits = await fetchAllPaginated(
    (page) =>
      apiClient.get<ZetkinHouseholdVisit[]>(
        `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}/household_visits?page=${page}&size=100`
      ),
    100
  );

  return { visits };
}
