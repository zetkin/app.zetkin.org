import { TreeItemData } from '../types';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

export default function generateTreeData(
  organizations: ZetkinOrganization[],
  memberships: ZetkinMembership[]
): TreeItemData[] {
  const roleByOrgId: Record<number, string | null> = {};
  const orgsByParentId: Record<number, ZetkinOrganization[]> = {};

  // Extract the user's role for each organization that they are connected to
  memberships.forEach(
    (membership) => (roleByOrgId[membership.organization.id] = membership.role)
  );

  // Find relevant organizations and build a cache of parent-child relationships
  const relevantOrgs = organizations.filter((org) => {
    // While we're looping, build a cache of parent-child relationships
    if (org.parent) {
      const existing = orgsByParentId[org.parent.id] || [];
      orgsByParentId[org.parent.id] = [...existing, org];
    }

    // Only the organizations in which the user has a role are relevant
    return !!roleByOrgId[org.id];
  });

  // Top level orgs are the ones that have no parent, or where that parent
  // is not amongst the relevant organizations.
  const topLevelOrgs = relevantOrgs.filter(
    (org) => !org.parent || !roleByOrgId[org.parent.id]
  );

  const buildTree = (parent: ZetkinOrganization): TreeItemData => {
    const childOrgs: ZetkinOrganization[] = orgsByParentId[parent.id] || [];
    return {
      children: childOrgs.map(buildTree),
      id: parent.id,
      title: parent.title,
    };
  };

  return topLevelOrgs.map(buildTree);
}
