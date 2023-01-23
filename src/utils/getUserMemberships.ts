import { ScaffoldedContext } from './next';
import { ZetkinMembership } from 'utils/types/zetkin';

const getUserMemberships = async (
  ctx: ScaffoldedContext,
  allowNonOfficials = false
): Promise<number[]> => {
  const membershipsRes = await ctx.z
    .resource('users', 'me', 'memberships')
    .get();
  const membershipsData = membershipsRes.data.data as ZetkinMembership[];

  return membershipsData
    .filter((membership) => allowNonOfficials || membership.role)
    .map((membership) => membership.organization.id);
};

export default getUserMemberships;
