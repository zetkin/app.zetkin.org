import { generateTreeData } from './generateTreeData';
import { TreeItemData } from '../rpc/getOrganizations';
import { describe, expect, it } from '@jest/globals';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

interface mockOrganization {
  id: number;
  title: string;
}

interface mockMembership {
  organization: {
    id: number;
    title: string;
  };
  role: string;
}

function mockOrganizations(organization: mockOrganization): ZetkinOrganization {
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

function mockMemberships(membership: mockMembership): ZetkinMembership {
  return {
    follow: true,
    inherited: undefined,
    organization: mockOrganizations(membership.organization),
    profile: { id: 112, name: 'Test profile' },
    role: membership.role,
  };
}

describe('generateTreeData()', () => {
  it('creates an empty tree when there are not organizations', () => {
    const organizations: ZetkinOrganization[] = [];
    const memberships: ZetkinMembership[] = [
      mockMemberships({
        organization: { id: 1, title: 'Party A' },
        role: 'Admin',
      }),
    ];

    const expectedTreeData: TreeItemData[] = [];

    const treeData = generateTreeData(organizations, memberships);

    expect(treeData).toEqual(expectedTreeData);
  });
  it('creates flat list of unrelated organizations', () => {
    const organizations: ZetkinOrganization[] = [
      mockOrganizations({
        id: 1,
        title: 'Party A',
      }),
      mockOrganizations({
        id: 2,
        title: 'Party B',
      }),
    ];

    const memberships: ZetkinMembership[] = [
      mockMemberships({
        organization: { id: 1, title: 'Party A' },
        role: 'Admin',
      }),
      mockMemberships({
        organization: { id: 2, title: 'Party B' },
        role: 'Admin',
      }),
    ];

    const result = generateTreeData(organizations, memberships);

    const expectedTreeData: TreeItemData[] = [
      {
        avatar_file: null,
        children: null,
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
        children: null,
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
      mockOrganizations({
        id: 1,
        title: 'Party A',
      }),
      mockOrganizations({
        id: 2,
        title: 'Party B',
      }),
    ];

    const memberships: ZetkinMembership[] = [
      mockMemberships({
        organization: { id: 3, title: 'Party C' },
        role: 'Admin',
      }),
      mockMemberships({
        organization: { id: 4, title: 'Party D' },
        role: 'Admin',
      }),
    ];

    const result = generateTreeData(organizations, memberships);

    const expectedTreeData: TreeItemData[] = [];

    expect(result).toEqual(expectedTreeData);
  });
});
