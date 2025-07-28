import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinLocation as ZetkinEventLocation } from 'utils/types/zetkin';
import { ZetkinLocation } from 'features/areaAssignments/types';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinEventLocation[];

export const loadEventLocationsDef = {
  handler: handle,
  name: 'loadEventLocationsDef',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(loadEventLocationsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId } = params;
  const listOfLocations = await fetchAllPaginated<ZetkinLocation>((page) =>
    apiClient.get(`/api2/orgs/${orgId}/locations?size=100&page=${page}`)
  );

  const locations = listOfLocations
    .filter(excludeLocationsCreatedWhileCanvassing)
    .map((location) => ({
      id: location.id,
      info_text: location.description,
      lat: location.latitude,
      lng: location.longitude,
      title: location.title,
    }));

  return locations;
}

function excludeLocationsCreatedWhileCanvassing(
  location: ZetkinLocation
): boolean {
  const hasUserInfo = location.created_by_user_id;
  const createdWithApiV1 = !hasUserInfo;
  return createdWithApiV1;
}
