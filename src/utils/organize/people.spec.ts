import isEqual from 'lodash.isequal';
import { nestByParentId } from './organizations';
import { ZetkinOrganization } from 'types/zetkin';
import {
  getConnectedOrganisations,
  getPersonOrganisations,
  PersonOrganisation,
} from './people';

const flatOrgs: ZetkinOrganization[] = [
  {
    id: 1,
    title: 'Root Org',
  },
  {
    id: 2,
    parent: { id: 1 },
    title: 'First sub-org',
  },
  {
    id: 3,
    parent: { id: 1 },
    title: 'Second sub-org',
  },
  {
    id: 4,
    parent: { id: 1 },
    title: 'Third sub-org',
  },
  {
    id: 33,
    parent: { id: 3 },
    title: 'Child of second sub-org',
  },
].map((org) => ({ ...org, is_active: true, sub_orgs: [] }));

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
      const orgsTree = nestByParentId(flatOrgs, null) as [PersonOrganisation];
      expect(orgsTree.length).toEqual(1);
      expect(orgsTree[0].title).toEqual(flatOrgs[0].title);
      expect(orgsTree[0]?.sub_orgs?.length).toEqual(3);
      expect(orgsTree[0]?.sub_orgs[1].sub_orgs[0].id).toEqual(flatOrgs[4].id);
    });
  });
});
