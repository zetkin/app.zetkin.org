import { z } from 'zod';

import { ZetkinOrganization, ZetkinSubOrganization } from 'utils/types/zetkin';
import { makeRPCDef } from 'core/rpc/types';
import IApiClient from 'core/api/client/IApiClient';

const paramsSchema = z.object({});
type Params = z.input<typeof paramsSchema>;

export const getPublicOrganizationsDef = {
  handler: handle,
  name: 'getPublicOrganizations',
  schema: paramsSchema,
};

export default makeRPCDef<Params, ZetkinOrganization[]>(
  getPublicOrganizationsDef.name
);

const fetchRootOrgs = (rootOrgIds: number[], apiClient: IApiClient) =>
  Promise.all(
    rootOrgIds.map((orgId) =>
      apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`).catch(() => null)
    )
  );

const fetchSubOrgsByRootOrgs = (rootOrgIds: number[], apiClient: IApiClient) =>
  Promise.all(
    rootOrgIds.map((orgId) =>
      apiClient
        .get<ZetkinSubOrganization[]>(
          `/api/orgs/${orgId}/sub_organizations?recursive`
        )
        .catch(() => [] as ZetkinSubOrganization[])
    )
  );

async function handle(params: Params, apiClient: IApiClient) {
  const rootOrgIds = (process.env.ZETKIN_ROOT_ORGANIZATION_IDS || '')
    .split(',')
    .map(parseInt);

  const [rootOrgs, subOrgs] = await Promise.all([
    fetchRootOrgs(rootOrgIds, apiClient),
    fetchSubOrgsByRootOrgs(rootOrgIds, apiClient),
  ]);

  const orgs = rootOrgs.filter((org) => !!org);
  const foundOrgIds = new Set(orgs.map((org) => org.id));

  dfsAddOrgs(subOrgs.flat(), orgs, foundOrgIds);

  return orgs;
}

const dfsAddOrgs = (
  subOrgs: ZetkinSubOrganization[],
  outputList: ZetkinOrganization[],
  foundIdSet: Set<number>
) => {
  subOrgs.forEach((subOrg) => {
    if (!subOrg.sub_orgs) {
      return;
    }
    dfsAddOrgs(subOrg.sub_orgs, outputList, foundIdSet);
  });

  subOrgs.forEach((subOrg) => {
    if (foundIdSet.has(subOrg.id)) {
      return;
    }

    const org: ZetkinOrganization & Partial<ZetkinSubOrganization> = {
      ...subOrg,
    };
    delete org.sub_orgs;
    outputList.push(org);
  });
};
