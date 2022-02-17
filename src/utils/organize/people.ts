import { ZetkinMembership, ZetkinOrganization } from 'types/zetkin';

export type PersonOrganisation = Omit<ZetkinOrganization, 'sub_orgs'> & {
  connected?: boolean;
  sub_orgs: PersonOrganisation[];
};

export const getConnectedOrganisations = (
  allOrgs: ZetkinOrganization[],
  personConnections: Partial<ZetkinMembership>[]
): PersonOrganisation[] => {
  return allOrgs
    .filter((org) =>
      personConnections.map((conn) => conn?.organization?.id).includes(org?.id)
    )
    .map((org) => ({ ...org, connected: true }));
};

export const getPersonOrganisations = (
  allOrganisations: ZetkinOrganization[],
  connectedOrganisations: PersonOrganisation[]
): PersonOrganisation[] => {
  const personOrgs = [...connectedOrganisations];

  const getParentOrgs = (org: PersonOrganisation): PersonOrganisation[] => {
    const [directParent] = allOrganisations.filter(
      (item) => item.id === org?.parent?.id
    );
    return directParent
      ? [directParent].concat(getParentOrgs(directParent))
      : [];
  };

  connectedOrganisations.forEach((org) => {
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
