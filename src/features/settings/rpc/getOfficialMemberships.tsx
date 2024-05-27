import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinMembership, ZetkinOfficial } from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinMembership[];

export const getOfficialMembershipsDef = {
  handler: handle,
  name: 'getOfficialMemberships',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getOfficialMembershipsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId } = params;
  const memberships: ZetkinMembership[] = [];

  const officials = await apiClient.get<ZetkinOfficial[]>(
    `/api/orgs/${orgId}/officials`
  );

  for (const official of officials) {
    const membership = await apiClient.get<[ZetkinMembership]>(
      `/api/orgs/${orgId}/people/${official.id}/connections`
    );
    memberships.push(membership.find((m) => m.organization.id == orgId)!);
  }

  return memberships;
}
