import { ZetkinSubOrganization } from 'utils/types/zetkin';

export default function flattenSubOrgs(orgs: ZetkinSubOrganization[]) {
  let subOrgs: ZetkinSubOrganization[] = [];
  orgs.forEach((org) => {
    if (org.sub_orgs.length > 0) {
      const children = flattenSubOrgs(org.sub_orgs);
      if (children.length > 0) {
        subOrgs = [...children, ...subOrgs];
      }
    }
    subOrgs.unshift(org);
  });
  return subOrgs;
}
