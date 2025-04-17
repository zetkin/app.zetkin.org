import { useApiClient, useAppDispatch } from 'core/hooks';
import { orgFollowed, orgUnfollowed } from '../store';
import { ZetkinMembership } from 'utils/types/zetkin';

export default function useFollowOrgMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const followOrg = async (membership: ZetkinMembership) => {
    await apiClient.put(`/api/users/me/following/${orgId}`, {
      follow: true,
    });
    dispatch(orgFollowed(membership));
  };

  const unfollowOrg = async () => {
    await apiClient.delete(`/api/users/me/following/${orgId}`);
    dispatch(orgUnfollowed(orgId));
  };

  return { followOrg, unfollowOrg };
}
