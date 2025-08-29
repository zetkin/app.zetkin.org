import { paramsSchema, Params, Result } from './client';
import { HouseholdWithColor } from 'features/canvass/types';
import IApiClient from 'core/api/client/IApiClient';

export const createHouseholdsDef = {
  handler: handle,
  name: 'createHouseholds',
  schema: paramsSchema,
};

async function handle(
  { households, locationId, orgId }: Params,
  apiClient: IApiClient
): Promise<Result> {
  return Promise.all(
    households.map((input) =>
      apiClient.post<HouseholdWithColor>(
        `/api2/orgs/${orgId}/locations/${locationId}/households`,
        {
          level: input.level,
          title: input.title,
        }
      )
    )
  );
}
