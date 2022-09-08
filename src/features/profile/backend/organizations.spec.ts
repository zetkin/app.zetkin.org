import { PersonOrganization } from './people';
import { flattenTree, nestByParentId } from './organizations';

export const flatOrgs: PersonOrganization[] = [
  {
    id: 1,
    sub_orgs: [],
    title: 'Root Org',
  },
  {
    id: 2,
    parent: { id: 1, title: 'Root org' },
    sub_orgs: [],
    title: 'First sub-org',
  },
  {
    id: 3,
    parent: { id: 1, title: 'Root org' },
    sub_orgs: [],
    title: 'Second sub-org',
  },
  {
    id: 4,
    parent: { id: 1, title: 'Root org' },
    sub_orgs: [],
    title: 'Third sub-org',
  },
  {
    id: 33,
    parent: { id: 3, title: 'Second sub-org' },
    sub_orgs: [],
    title: 'Child of second sub-org',
  },
].map((org) => ({ ...org, is_active: true }));

const orgTree: PersonOrganization = {
  id: 3,
  parent: { id: 1, title: 'Root org' },
  sub_orgs: [
    {
      id: 33,
      parent: { id: 3, title: 'Second sub-org' },
      sub_orgs: [],
      title: 'Child of second sub-org',
    },
  ],
  title: 'Second sub-org',
};

describe('People utils', () => {
  describe('flattenTree()', () => {
    it('Returns a flat array of organizations from an organization tree', async () => {
      const flattened = flattenTree(orgTree);
      expect(flattened.length).toEqual(2);
    });
  });

  describe('nestByParentId()', () => {
    it('Returns the correct organization tree from a flat array of organizations', async () => {
      const orgsTree = nestByParentId(flatOrgs, null);
      expect(orgsTree.length).toEqual(1);
      expect(orgsTree[0].title).toEqual(flatOrgs[0].title);
      expect(orgsTree[0]?.sub_orgs?.length).toEqual(3);
      expect(orgsTree[0]?.sub_orgs[1].sub_orgs[0].id).toEqual(flatOrgs[4].id);
    });
  });
});
