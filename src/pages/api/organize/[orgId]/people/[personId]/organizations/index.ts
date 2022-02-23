import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { ZetkinMembership } from 'types/zetkin';
import { flattenTree, nestByParentId } from 'utils/organize/organizations';
import {
  getConnectedOrganizations,
  getPersonOrganizations,
  PersonOrganization,
} from 'utils/organize/people';

const getOrganizationTrees = async (
  req: NextApiRequest & { query: Record<string, string> },
  res: NextApiResponse
): Promise<void> => {
  const {
    query: { orgId, personId },
    method,
  } = req;

  // Return error if method other than GET
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const apiFetch = createApiFetch(req.headers);

  try {
    const rootOrgRes = await apiFetch(`/orgs/${orgId}`);
    const subOrgRes = await apiFetch(
      `/orgs/${orgId}/sub_organizations?recursive`
    );
    const connectionsRes = await apiFetch(
      `/orgs/${orgId}/people/${personId}/connections`
    );

    const { data: subOrgs } = await subOrgRes.json();
    const { data: rootOrg } = await rootOrgRes.json();
    const { data: personConnections }: { data: Partial<ZetkinMembership>[] } =
      await connectionsRes.json();

    const orgTree = { ...rootOrg, sub_orgs: subOrgs };

    // First pass - include all orgs that the member is directly connected to
    const connectedOrgs = getConnectedOrganizations(
      flattenTree(orgTree) as PersonOrganization[],
      personConnections
    );

    // Second pass - include all parent orgs, recursively, of any org the member is connected to
    const personOrgs = getPersonOrganizations(
      flattenTree(orgTree) as PersonOrganization[],
      connectedOrgs as PersonOrganization[]
    );

    // Return organizations trees
    res.status(200).json({
      data: {
        memberships: connectedOrgs,
        organizationTree: orgTree,
        personOrganizationTree: nestByParentId(personOrgs, null)[0],
        subOrganizations: flattenTree(orgTree).sort((a, b) =>
          a.title > b.title ? 1 : -1
        ),
      },
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default getOrganizationTrees;
