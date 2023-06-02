import { TreeItemData } from '../rpc/getOrganizations';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

function userHasRoleInParentOrganization(
  organization: ZetkinOrganization,
  userRoleOrgIds: Set<number>
) {
  return organization.parent && userRoleOrgIds.has(organization.parent.id);
}

function nodeShouldBeHidden(
  organization: ZetkinOrganization,
  userRoleOrgIds: Set<number>,
  hasUserRole: boolean
) {
  return (
    !hasUserRole &&
    !userHasRoleInParentOrganization(organization, userRoleOrgIds)
  );
}

export default function generateTreeData(
  organizations: ZetkinOrganization[],
  memberships: ZetkinMembership[]
): TreeItemData[] {
  const userRoleOrgIds: Set<number> = new Set();

  // Helper function to recursively build the tree structure
  const buildTree = (orgId: number): TreeItemData | null => {
    const organization = organizations.find((org) => org.id === orgId);

    if (!organization) {
      return null;
    }

    const hasUserRole = memberships.some(
      (membership) =>
        membership.organization.id === orgId && membership.role !== null
    );

    // Skip organizations where the user doesn't have a role and there is no parent organization with user's role
    if (nodeShouldBeHidden(organization, userRoleOrgIds, hasUserRole)) {
      return null;
    }

    const children: TreeItemData[] = organizations
      .filter((org) => org.parent && org.parent.id === orgId)
      .map((org) => buildTree(org.id))
      .filter((child) => child !== null) as TreeItemData[];

    return {
      ...organization,
      children,
    };
  };

  // Get the organization IDs where the user has a role
  for (const membership of memberships) {
    if (membership.role !== null) {
      userRoleOrgIds.add(membership.organization.id);
    }
  }

  // Build the tree structure starting from top-level organizations
  const treeData: TreeItemData[] = organizations
    .filter((org) => !org.parent)
    .map((org) => buildTree(org.id))
    .filter((org) => org !== null) as TreeItemData[];

  return treeData;
}
