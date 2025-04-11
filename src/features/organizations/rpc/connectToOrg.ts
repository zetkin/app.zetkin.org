import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinMembership, ZetkinPersonNativeFields } from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.infer<typeof paramsSchema>;

export type Result = {
  memberships: ZetkinMembership[];
};

export const connectToOrgDef = {
  handler: handle,
  name: 'connectToOrg',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(connectToOrgDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId } = params;

  const person = await apiClient.post<ZetkinPersonNativeFields>(
    `/api/orgs/${orgId}/join_requests`,
    {}
  );

  let memberships: ZetkinMembership[] = [];

  if (person.id) {
    memberships = await apiClient.get<ZetkinMembership[]>(
      `/api/users/me/memberships`
    );

    const membership =
      memberships.find((m) => m.organization.id === orgId) || null;
    if (membership) {
      await apiClient.put(`/api/users/me/following/${orgId}`, {
        follow: true,
      });
    }
  }

  return { memberships };
}
