import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import {
  getConnectedOrganisations,
  getPersonOrganisations,
  nestByParentId,
  PersonOrganisation,
} from 'utils/organize/people';
import { ZetkinMembership, ZetkinOrganization } from 'types/zetkin';

const getOrganisationTrees = async (
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
    const subOrgRes = await apiFetch(`/orgs/${orgId}/sub_organizations`);
    const connectionsRes = await apiFetch(
      `/orgs/${orgId}/people/${personId}/connections`
    );

    const { data: subOrgs } = await subOrgRes.json();
    const { data: rootOrg } = await rootOrgRes.json();
    const { data: personConnections }: { data: Partial<ZetkinMembership>[] } =
      await connectionsRes.json();

    // Map root organisation and all sub-organisations into flat array
    const allOrgs: PersonOrganisation[] = [
      { id: rootOrg.id, parentId: null, title: rootOrg.title },
    ].concat(
      subOrgs.map((org: ZetkinOrganization) => ({
        id: org.id,
        parentId: org?.parent?.id,
        title: org.title,
      }))
    );

    // First pass - include all orgs that the member is directly connected to
    const connectedOrgs = getConnectedOrganisations(allOrgs, personConnections);

    // Second pass - include all parent orgs, recursively, of any org the member is connected to
    const personOrgs = getPersonOrganisations(allOrgs, connectedOrgs);

    // Return organisations trees
    res.status(200).json({
      data: {
        organisationTree: nestByParentId(allOrgs, null)[0],
        personOrganisationTree: nestByParentId(personOrgs, null)[0],
      },
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default getOrganisationTrees;
