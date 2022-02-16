import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { nestByParentId } from 'utils';
import { ZetkinMembership, ZetkinOrganization } from 'types/zetkin';

type PersonOrganisation = ZetkinOrganization & {
  connected?: boolean;
  [key: string]: unknown;
  parentId: number | null;
};

const getPersonOrganisations = async (
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
    const parentOrgRes = await apiFetch(`/orgs/${orgId}`);
    const subOrgRes = await apiFetch(`/orgs/${orgId}/sub_organizations`);
    const connectionsRes = await apiFetch(
      `/orgs/${orgId}/people/${personId}/connections`
    );
    const { data: subOrgs } = await subOrgRes.json();
    const { data: parentOrg } = await parentOrgRes.json();
    const { data: personConnections }: { data: Partial<ZetkinMembership>[] } =
      await connectionsRes.json();

    const allOrgs: PersonOrganisation[] = [
      { id: parentOrg.id, parentId: null, title: parentOrg.title },
    ].concat(
      subOrgs.map((org: ZetkinOrganization) => ({
        id: org.id,
        parentId: org?.parent?.id,
        title: org.title,
      }))
    );

    // First pass - include all orgs that the member is directly connected to
    const connectedOrgs = allOrgs
      .filter((org) =>
        personConnections.map((conn) => conn?.organization?.id).includes(org.id)
      )
      .map((org) => ({ ...org, connected: true }));

    // Second pass - include any parent orgs, recursively, of any org the member is connected to
    const personOrgs = connectedOrgs;

    const getParentOrgs = (org: PersonOrganisation): PersonOrganisation[] => {
      const [directParent] = allOrgs.filter((item) => item.id === org.parentId);
      return directParent
        ? [directParent].concat(getParentOrgs(directParent))
        : [];
    };

    connectedOrgs.forEach((org) => {
      if (org.parentId) {
        const parentOrgs = getParentOrgs(org);
        const unconnectedOrgs = parentOrgs.filter(
          (parentOrg) => !personOrgs.map((o) => o.id).includes(parentOrg.id)
        );
        unconnectedOrgs.forEach((unconnectedOrg) => {
          personOrgs.push({
            ...unconnectedOrg,
            connected: false,
          });
        });
      }
    });

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

export default getPersonOrganisations;
