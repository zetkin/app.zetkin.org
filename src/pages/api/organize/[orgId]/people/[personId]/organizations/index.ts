import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { nestByParentId } from 'utils';
import { ZetkinOrganization } from 'types/zetkin';

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
    const cRes = await apiFetch(
      `/orgs/${orgId}/people/${personId}/connections`
    );
    const { data: subOrgs } = await subOrgRes.json();
    const { data: parentOrg } = await parentOrgRes.json();
    const { data: personConnections } = await cRes.json();

    const flatOrgs = [
      { id: parentOrg.id, parentId: null, title: parentOrg.title },
    ].concat(
      subOrgs.map((org: ZetkinOrganization) => ({
        id: org.id,
        parentId: org?.parent?.id,
        title: org.title,
      }))
    );

    res.status(200).json({
      data: {
        organisationTree: nestByParentId(flatOrgs, null)[0],
        personConnections,
      },
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default getPersonOrganisations;
