import { PersonOrganisation } from './people';
import { ZetkinOrganization } from 'types/zetkin';

export const nestByParentId = (
  items: Omit<PersonOrganisation, 'sub_orgs'>[],
  rootId: number | null
): Omit<PersonOrganisation, 'sub_orgs'>[] => {
  return items
    .filter((item) => (item.parent ? item.parent.id === rootId : !rootId))
    .map((item) => ({
      ...item,
      sub_orgs: nestByParentId(items, item.id),
    }))
    .sort((a, b) => (a.title > b.title ? 1 : -1));
};

export const flattenTree = (
  orgTree: ZetkinOrganization,
  flattened: ZetkinOrganization[] = []
): ZetkinOrganization[] => {
  const hasSubOrgs = !!orgTree?.sub_orgs?.length;
  const orgCopy: Partial<ZetkinOrganization> = { ...orgTree };
  delete orgCopy.sub_orgs;
  flattened.push(orgCopy as ZetkinOrganization);
  if (hasSubOrgs) {
    orgTree?.sub_orgs?.forEach((subOrg) => {
      if (!subOrg.sub_orgs.length) {
        const subOrgCopy: Partial<ZetkinOrganization> = { ...subOrg };
        delete subOrgCopy.sub_orgs;
        flattened.push(subOrgCopy as ZetkinOrganization);
      } else {
        flattened = flattenTree(subOrg, flattened);
      }
    });
  }
  return flattened;
};
