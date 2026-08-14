import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinOrganization } from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.infer<typeof paramsSchema>;
type Result = ZetkinOrganization;

export const getRootOrganizationDef = {
  handler: handle,
  name: 'getRootOrganization',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getRootOrganizationDef.name);

const fetchRootOrganization = async (
  currentOrgId: number,
  apiClient: IApiClient
): Promise<ZetkinOrganization> => {
  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${currentOrgId}`
  );

  if (!org.parent) {
    return org;
  }

  return fetchRootOrganization(org.parent.id, apiClient);
};

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  return fetchRootOrganization(params.orgId, apiClient);
}
