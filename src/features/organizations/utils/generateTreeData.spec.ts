import generateTreeData from './generateTreeData';
import { TreeItemData } from '../types';
import { describe, expect, it } from '@jest/globals';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

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
      mockOrganization(1),
      mockOrganization(2),
    ];

    const memberships: ZetkinMembership[] = [
      mockMembership(1, 'admin'),
      mockMembership(2, 'admin'),
    ];

    const result = generateTreeData(organizations, memberships);

    const expectedTreeData: TreeItemData[] = [
      {
        children: [],
        id: 1,
        parent: null,
        title: 'Org 1',
      },
      {
        children: [],
        id: 2,
        parent: null,
        title: 'Org 2',
      },
    ];

    expect(result).toEqual(expectedTreeData);
  });

  it('ignores inactive organizations', () => {
    const organizations: ZetkinOrganization[] = [
      mockOrganization(1),
      {
        ...mockOrganization(2, 1),
        is_active: false,
      },
      mockOrganization(3, 2),
    ];

    const memberships: ZetkinMembership[] = [
      mockMembership(1, 'admin'),
      mockMembership(3, 'admin'),
    ];

    const result = generateTreeData(organizations, memberships);

    expect(result).toEqual(<TreeItemData[]>[
      {
        children: [],
        id: 1,
        title: 'Org 1',
      },
      {
        children: [],
        id: 3,
        title: 'Org 3',
      },
    ]);
  });

  it('ignores organizations without membership', () => {
    const organizations: ZetkinOrganization[] = [
      mockOrganization(1),
      mockOrganization(2),
    ];

    const memberships: ZetkinMembership[] = [
      mockMembership(3, 'organizer'),
      mockMembership(4, 'admin'),
      mockMembership(5, null),
    ];

    const result = generateTreeData(organizations, memberships);

    const expectedTreeData: TreeItemData[] = [];

    expect(result).toEqual(expectedTreeData);
  });

  it('considers a child org a top org if the user doesnt have access to parent org', () => {
    const organizations: ZetkinOrganization[] = [
      mockOrganization(1),
      mockOrganization(2, 1),
    ];

    const memberships: ZetkinMembership[] = [
      mockMembership(1, null),
      mockMembership(2, 'organizer'),
    ];

    const result = generateTreeData(organizations, memberships);

    const expectedTreeData: TreeItemData[] = [
      {
        children: [],
        id: 2,
        parent: null,
        title: 'Org 2',
      },
    ];

    expect(result).toEqual(expectedTreeData);
  });

  it('handles a missing organization without crashing', () => {
    const organizations: ZetkinOrganization[] = [];
    const memberships: ZetkinMembership[] = [mockMembership(1, 'admin')];

    const expectedTreeData: TreeItemData[] = [];

    const treeData = generateTreeData(organizations, memberships);

    expect(treeData).toEqual(expectedTreeData);
  });
});

function mockOrganization(id: number, parentId?: number): ZetkinOrganization {
  return {
    avatar_file: null,
    country: 'SE',
    email: null,
    id: id,
    is_active: true,
    is_open: false,
    is_public: true,
    lang: null,
    parent: parentId
      ? {
          id: parentId,
          title: `Org ${parentId}`,
        }
      : null,
    phone: null,
    slug: 'slug',
    title: `Org ${id}`,
  };
}

function mockMembership(
  orgId: number,
  role?: 'admin' | 'organizer' | null
): ZetkinMembership {
  return {
    follow: true,
    inherited: undefined,
    organization: {
      id: orgId,
      title: `Org ${orgId}`,
    },
    profile: { id: 112, name: 'Test profile' },
    role: role || null,
  };
}
