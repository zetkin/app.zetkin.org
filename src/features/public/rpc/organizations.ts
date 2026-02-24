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

  const rootOrgsList = rootOrgs.filter(
    (org): org is ZetkinOrganization => !!org
  );
  const flattenedSubOrgs = flattenSubOrgsToOrgs(subOrgs.flat());

  const seen = new Set<number>();
  const distinctFlattenedOrgs = [...rootOrgsList, ...flattenedSubOrgs].filter(
    (org) => {
      if (seen.has(org.id)) {
        return false;
      }
      seen.add(org.id);
      return true;
    }
  );

  return distinctFlattenedOrgs;
}

function flattenSubOrgsToOrgs(
  subOrgs: ZetkinSubOrganization[]
): ZetkinOrganization[] {
  const result: ZetkinOrganization[] = [];
  const stack = [...subOrgs].reverse();

  while (stack.length > 0) {
    const subOrg = stack.pop()!;
    const children = subOrg.sub_orgs ?? [];
    stack.push(...[...children].reverse());

    const { sub_orgs: _subOrgs, ...org } = subOrg;
    void _subOrgs;
    result.push(org);
  }

  return result;
}
