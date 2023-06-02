import generateTreeData from '../utils/generateTreeData';
import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { TreeItemData } from '../types';
import { z } from 'zod';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

const paramsSchema = z.object({});

type Params = z.input<typeof paramsSchema>;
type Result = TreeItemData[];

export const getOrganizationsDef = {
  handler: handle,
  name: 'getUserOrganizations',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getOrganizationsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const allOrganizations = await apiClient.get<ZetkinOrganization[]>(
    `/api/orgs/`
  );

  const memberships = await apiClient.get<ZetkinMembership[]>(
    `/api/users/me/memberships`
  );

  const orgData = generateTreeData(allOrganizations, memberships);

  return orgData;
}
