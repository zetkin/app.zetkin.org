import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { HouseholdPatchBody, Zetkin2Household } from 'features/canvass/types';

const paramsSchema = z.object({
  color: z.optional(z.nullable(z.string())),
  householdIds: z.array(z.number()),
  level: z.optional(z.number()),
  locationId: z.number(),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = {
  updatedHouseholds: Zetkin2Household[];
};

export const editHouseholdsDef = {
  handler: handle,
  name: 'editHouseholds',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(editHouseholdsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { locationId, color, level, householdIds, orgId } = params;

  const updatedHouseholds: Zetkin2Household[] = [];

  for (const householdId of householdIds) {
    const updatedHousehold = await apiClient.patch<
      Zetkin2Household,
      HouseholdPatchBody
    >(`/beta/orgs/${orgId}/locations/${locationId}/households/${householdId}`, {
      color: color,
      level,
    });

    updatedHouseholds.push(updatedHousehold);
  }

  return { updatedHouseholds };
}
