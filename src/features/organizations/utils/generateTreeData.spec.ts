import { generateTreeData } from './generateTreeData';
import { TreeItemData } from '../rpc/getOrganizations';
import { describe, expect, it } from '@jest/globals';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

interface mockOrg {
  id: number;
  title: string;
  parent?: mockOrg;
}

interface mockMember {
  organization: {
    id: number;
    title: string;
  };
  role: string;
}

function mockOrganization(organization: mockOrg): ZetkinOrganization {
  const injectedProperties = {
    avatar_file: null,
    country: 'SE',
    email: null,
    is_active: false,
    is_open: false,
    is_public: true,
    lang: null,
    parent: null,
    phone: null,
    slug: 'slug',
  };

  return { ...organization, ...injectedProperties };
}

function mockMembership(membership: mockMember): ZetkinMembership {
  return {
    follow: true,
    inherited: undefined,
    organization: mockOrganization(membership.organization),
    profile: { id: 112, name: 'Test profile' },
    role: membership.role,
  };
}

describe('generateTreeData()', () => {
  it('creates an empty tree when there are not organizations or memberships', () => {
    const organizations: ZetkinOrganization[] = [];
    const memberships: ZetkinMembership[] = [];

    const expectedTreeData: TreeItemData[] = [];

    const treeData = generateTreeData(organizations, memberships);

    expect(treeData).toEqual(expectedTreeData);
  });
  it('creates flat list of unrelated organizations', () => {
    const organizations: ZetkinOrganization[] = [
      mockOrganization({
        id: 1,
        title: 'Party A',
      }),
      mockOrganization({
        id: 2,
        title: 'Party B',
      }),
    ];

    const memberships: ZetkinMembership[] = [
      mockMembership({
        organization: { id: 1, title: 'Party A' },
        role: 'Admin',
      }),
      mockMembership({
        organization: { id: 2, title: 'Party B' },
        role: 'Admin',
      }),
    ];

    const result = generateTreeData(organizations, memberships);

    const expectedTreeData: TreeItemData[] = [
      {
        avatar_file: null,
        children: [],
        country: 'SE',
        email: null,
        id: 1,
        is_active: false,
        is_open: false,
        is_public: true,
        lang: null,
        parent: null,
        phone: null,
        slug: 'slug',
        title: 'Party A',
      },
      {
        avatar_file: null,
        children: [],
        country: 'SE',
        email: null,
        id: 2,
        is_active: false,
        is_open: false,
        is_public: true,
        lang: null,
        parent: null,
        phone: null,
        slug: 'slug',
        title: 'Party B',
      },
    ];

    expect(result).toEqual(expectedTreeData);
  });
  it('ignores organizations without membership', () => {
    const organizations: ZetkinOrganization[] = [
      mockOrganization({
        id: 1,
        title: 'Party A',
      }),
      mockOrganization({
        id: 2,
        title: 'Party B',
      }),
    ];

    const memberships: ZetkinMembership[] = [
      mockMembership({
        organization: { id: 3, title: 'Party C' },
        role: 'Admin',
      }),
      mockMembership({
        organization: { id: 4, title: 'Party D' },
        role: 'Admin',
      }),
    ];

    const result = generateTreeData(organizations, memberships);

    const expectedTreeData: TreeItemData[] = [];

    expect(result).toEqual(expectedTreeData);
  });
  it('considers a child org a top org if the user doesnt have access to parent org', () => {
    const organizations: ZetkinOrganization[] = [
      mockOrganization({
        id: 1,
        title: 'Party A',
      }),
      mockOrganization({
        id: 2,
        parent: {
          id: 1,
          title: 'Party A',
        },
        title: 'Party B',
      }),
    ];

    const memberships: ZetkinMembership[] = [
      mockMembership({
        organization: { id: 2, title: 'Party C' },
        role: 'Admin',
      }),
    ];

    const result = generateTreeData(organizations, memberships);

    const expectedTreeData: TreeItemData[] = [
      {
        avatar_file: null,
        children: [],
        country: 'SE',
        email: null,
        id: 2,
        is_active: false,
        is_open: false,
        is_public: true,
        lang: null,
        parent: null,
        phone: null,
        slug: 'slug',
        title: 'Party B',
      },
    ];

    expect(result).toEqual(expectedTreeData);
  });
  it('handles a missing organization without crashing', () => {
    const organizations: ZetkinOrganization[] = [];
    const memberships: ZetkinMembership[] = [
      mockMembership({
        organization: { id: 1, title: 'Party A' },
        role: 'Admin',
      }),
    ];

    const expectedTreeData: TreeItemData[] = [];

    const treeData = generateTreeData(organizations, memberships);

    expect(treeData).toEqual(expectedTreeData);
  });
});
