import { ScaffoldedContext } from './next';
import { ZetkinUser } from 'utils/types/zetkin';

const getSuperUser = async (
  ctx: ScaffoldedContext,
  allowAnyone = false
): Promise<boolean> => {
  const userStatusRes = await ctx.z.resource('users', 'me').get();
  const userData = userStatusRes.data.data as ZetkinUser;

  return !!(allowAnyone || userData?.is_superuser);
};

export default getSuperUser;
