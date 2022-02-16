import isEqual from 'lodash.isequal';
import {
  getConnectedOrganisations,
  getPersonOrganisations,
  nestByParentId,
} from './people';

const flatOrgs = [
  {
    id: 1,
    parentId: null,
    title: 'Root Org',
  },
  {
    id: 2,
    parentId: 1,
    title: 'First sub-org',
  },
  {
    id: 3,
    parentId: 1,
    title: 'Second sub-org',
  },
  {
    id: 4,
    parentId: 1,
    title: 'Third sub-org',
  },
  {
    id: 33,
    parentId: 3,
    title: 'Child of second sub-org',
  },
];

const personConnections = [
  {
    organization: flatOrgs[0],
  },
  {
    organization: flatOrgs[1],
  },
  {
    organization: flatOrgs[4],
  },
];

describe('People utils', () => {
  describe('getConnectedOrganisations()', () => {
    it('Properly picks organisations based on person connections', async () => {
      const connectedOrgs = getConnectedOrganisations(
        flatOrgs,
        personConnections
      );
      expect(connectedOrgs.length).toEqual(3);
      const returnIds = connectedOrgs.map((o) => o.id).sort();
      const inputIds = personConnections.map((pc) => pc.organization.id).sort();
      expect(isEqual(inputIds, returnIds)).toBeTruthy();
    });
  });

  describe('getPersonOrganisations()', () => {
    it('Picks parent organisations that are not connected to the person', () => {
      const connectedOrgs = getConnectedOrganisations(
        flatOrgs,
        personConnections
      );
      const personOrgs = getPersonOrganisations(flatOrgs, connectedOrgs);
      expect(connectedOrgs.length).toEqual(3);
      expect(personOrgs.length).toEqual(4);
      expect(connectedOrgs.filter((org) => org.id === 3).length).toEqual(0);
      expect(personOrgs.filter((org) => org.id === 3).length).toEqual(1);
    });
  });

  describe('nestByParentId()', () => {
    it('Returns the correct organisation tree from a flat array of organisations', async () => {
      const orgsTree = nestByParentId(flatOrgs, null);
      expect(orgsTree.length).toEqual(1);
      expect(orgsTree[0].title).toEqual(flatOrgs[0].title);
      expect(orgsTree[0]?.descendants?.length).toEqual(3);
      expect(orgsTree[0]?.descendants[1].descendants[0].id).toEqual(
        flatOrgs[4].id
      );
    });
  });
});
