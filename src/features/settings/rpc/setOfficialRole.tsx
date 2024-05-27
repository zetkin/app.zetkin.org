import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinMembership, ZetkinOfficial } from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
  personId: z.number(),
  role: z.union([z.literal('admin'), z.literal('organizer')]),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinMembership;

export const setOfficialRoleDef = {
  handler: handle,
  name: 'setOfficialRole',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(setOfficialRoleDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId, personId, role } = params;

  const official = await apiClient.put<ZetkinOfficial>(
    `/api/orgs/${orgId}/officials/${personId}`,
    { role: role }
  );

  const memberships = await apiClient.get<[ZetkinMembership]>(
    `/api/orgs/${orgId}/people/${official.id}/connections`
  );

  return memberships.find((m) => m.organization.id == orgId)!;
}
