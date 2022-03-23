import { ScaffoldedContext } from './next';
import { ZetkinMembership } from 'types/zetkin';

const getOrganizations = async (ctx: ScaffoldedContext): Promise<number[]> => {
  const membershipsRes = await ctx.z
    .resource('users', 'me', 'memberships')
    .get();
  const membershipsData = membershipsRes.data.data as ZetkinMembership[];

  return membershipsData
    .filter((membership) => membership.role)
    .map((membership) => membership.organization.id);
};

export default getOrganizations;
