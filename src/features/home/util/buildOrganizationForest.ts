import { OrganizationTreeElement } from '../components/OrganizationsForest';
import { ZetkinOrganization, ZetkinMembership } from 'utils/types/zetkin';

const buildOrganizationForest = (
  organizations: ZetkinOrganization[],
  memberships: ZetkinMembership[]
) => {
  const orgMap: { [key: number]: OrganizationTreeElement } = {};

  organizations.forEach((org) => {
    orgMap[org.id] = {
      children: [],
      membership: null,
      organization: org,
    };
  });

  const rootOrgs: OrganizationTreeElement[] = [];
  const idList: string[] = [];

  organizations.forEach((org) => {
    if (org.parent) {
      if (!orgMap[org.parent.id]) {
        // add pseudo organization to still show the public subtree
        orgMap[org.parent.id] = {
          children: [],
          membership: null,
          organization: {
            avatar_file: null,
            country: '',
            email: null,
            id: org.parent.id,
            is_active: false,
            is_open: false,
            is_public: false,
            lang: null,
            parent: null,
            phone: null,
            slug: null,
            title: `<${org.parent.id}>`,
          },
        };
      }

      orgMap[org.parent.id].children.push(orgMap[org.id]);
    } else {
      rootOrgs.push(orgMap[org.id]);
    }
    idList.push(org.id.toString());
  });

  memberships.forEach((mem) => {
    if (orgMap[mem.organization.id]) {
      orgMap[mem.organization.id].membership = mem;
    }
  });

  return {
    idList,
    orgMap,
    rootOrgs,
  };
};

export default buildOrganizationForest;
