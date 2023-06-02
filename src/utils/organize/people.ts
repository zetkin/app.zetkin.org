import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

export type PersonOrganization = Pick<ZetkinOrganization, 'id' | 'title'> & {
  connected?: boolean;
  is_active?: boolean;
  parent?: Pick<ZetkinOrganization, 'id' | 'title'> | null;
  sub_orgs: PersonOrganization[];
};

export const getConnectedOrganizations = (
  allOrgs: PersonOrganization[],
  personConnections: Partial<ZetkinMembership>[]
): PersonOrganization[] => {
  return allOrgs
    .filter((org) =>
      personConnections.map((conn) => conn?.organization?.id).includes(org?.id)
    )
    .map((org) => ({ ...org, connected: true }));
};

export const getPersonOrganizations = (
  allOrganizations: PersonOrganization[],
  connectedOrganizations: PersonOrganization[]
): PersonOrganization[] => {
  const personOrgs = [...connectedOrganizations];

  const getParentOrgs = (org: PersonOrganization): PersonOrganization[] => {
    const [directParent] = allOrganizations.filter(
      (item) => item.id === org?.parent?.id
    );
    return directParent
      ? [directParent].concat(getParentOrgs(directParent))
      : [];
  };

  connectedOrganizations.forEach((org) => {
    if (org?.parent?.id) {
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

  return personOrgs;
};
