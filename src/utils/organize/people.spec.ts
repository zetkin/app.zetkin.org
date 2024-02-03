import { flatOrgs } from './organizations.spec';
import { isEqual } from 'lodash';
import { getConnectedOrganizations, getPersonOrganizations } from './people';

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
  describe('getConnectedOrganizations()', () => {
    it('Properly picks organizations based on person connections', async () => {
      const connectedOrgs = getConnectedOrganizations(
        flatOrgs,
        personConnections
      );
      expect(connectedOrgs.length).toEqual(3);
      const returnIds = connectedOrgs.map((o) => o.id).sort();
      const inputIds = personConnections.map((pc) => pc.organization.id).sort();
      expect(isEqual(inputIds, returnIds)).toBeTruthy();
    });
  });

  describe('getPersonOrganizations()', () => {
    it('Picks parent organizations that are not connected to the person', () => {
      const connectedOrgs = getConnectedOrganizations(
        flatOrgs,
        personConnections
      );
      const personOrgs = getPersonOrganizations(flatOrgs, connectedOrgs);
      expect(connectedOrgs.length).toEqual(3);
      expect(personOrgs.length).toEqual(4);
      expect(connectedOrgs.filter((org) => org.id === 3).length).toEqual(0);
      expect(personOrgs.filter((org) => org.id === 3).length).toEqual(1);
    });
  });
});
