import { generateTreeData } from '../utils/generateTreeData';
import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { z } from 'zod';
import {
  ZetkinFile,
  ZetkinMembership,
  ZetkinOrganization,
} from 'utils/types/zetkin';

export interface TreeItemData {
  avatar_file: ZetkinFile | null;
  country: string | null;
  email: string | null;
  id: number;
  is_active: boolean;
  is_open: boolean;
  is_public: boolean;
  lang: string | null;
  parent: { id: number; title: string } | null;
  phone: string | null;
  slug: string | null;
  title: string;
  children: TreeItemData[] | null;
}

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
