import { PersonOrganization } from './people';

export const nestByParentId = (
  items: Omit<PersonOrganization, 'sub_orgs'>[],
  rootId: number | null
): PersonOrganization[] => {
  return items
    .filter((item) => (item.parent ? item.parent.id === rootId : !rootId))
    .map((item) => ({
      ...item,
      sub_orgs: nestByParentId(items, item.id),
    }))
    .sort((a, b) => (a.title > b.title ? 1 : -1));
};

export const flattenTree = (
  orgTree: PersonOrganization,
  flattened: Omit<PersonOrganization, 'sub_orgs'>[] = []
): Omit<PersonOrganization, 'sub_orgs'>[] => {
  const hasSubOrgs = !!orgTree?.sub_orgs?.length;
  const orgCopy = { ...orgTree } as Partial<PersonOrganization>;
  delete orgCopy.sub_orgs;
  flattened.push(orgCopy as Omit<PersonOrganization, 'sub_orgs'>);
  if (hasSubOrgs) {
    orgTree?.sub_orgs?.forEach((subOrg) => {
      if (!subOrg?.sub_orgs?.length) {
        const subOrgCopy = { ...subOrg } as Partial<PersonOrganization>;
        delete subOrgCopy.sub_orgs;
        flattened.push(subOrgCopy as Omit<PersonOrganization, 'sub_orgs'>);
      } else {
        flattened = flattenTree(subOrg, flattened);
      }
    });
  }
  return flattened;
};
