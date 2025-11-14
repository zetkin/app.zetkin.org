import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { Zetkin2Household, ZetkinHouseholdVisit } from 'features/canvass/types';
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

  const households = await fetchAllPaginated<Zetkin2Household>(
    (page) =>
      apiClient.get(
        `/api2/orgs/${orgId}/locations/${locationId}/households?size=100&page=${page}`
      ),
    100
  );
  const visits: ZetkinHouseholdVisit[] = [];
  for await (const household of households) {
    const householdVisits = await apiClient.get<ZetkinHouseholdVisit[]>(
      `/api2/orgs/${orgId}/area_assignments/${assignmentId}/households/${household.id}/visits`
    );
    visits.push(...householdVisits);
  }

  return { visits };
}
