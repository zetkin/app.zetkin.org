import { ZetkinMembership, ZetkinOrganization } from 'types/zetkin';

export type PersonOrganisation = ZetkinOrganization & {
  connected?: boolean;
  [key: string]: unknown;
  parentId: number | null;
};

export const getConnectedOrganisations = (
  allOrgs: PersonOrganisation[],
  personConnections: Partial<ZetkinMembership>[]
): PersonOrganisation[] => {
  return allOrgs
    .filter((org) =>
      personConnections.map((conn) => conn?.organization?.id).includes(org.id)
    )
    .map((org) => ({ ...org, connected: true }));
};

export const getPersonOrganisations = (
  allOrganisations: PersonOrganisation[],
  connectedOrganisations: PersonOrganisation[]
): PersonOrganisation[] => {
  const personOrgs = [...connectedOrganisations];

  const getParentOrgs = (org: PersonOrganisation): PersonOrganisation[] => {
    const [directParent] = allOrganisations.filter(
      (item) => item.id === org.parentId
    );
    return directParent
      ? [directParent].concat(getParentOrgs(directParent))
      : [];
  };

  connectedOrganisations.forEach((org) => {
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

  return personOrgs;
};

type FlatRecord = {
  id: number;
  [key: string]: unknown | unknown[];
  parentId: number | null;
};
type TreeRecord = FlatRecord & { descendants: TreeRecord[] };

export const nestByParentId = (
  items: FlatRecord[],
  rootId: number | null
): TreeRecord[] =>
  items
    .filter((item) => item.parentId === rootId)
    .map(
      (item): TreeRecord => ({
        ...item,
        descendants: nestByParentId(items, item.id),
      })
    );
