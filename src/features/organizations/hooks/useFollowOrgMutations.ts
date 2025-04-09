import { useApiClient, useAppDispatch } from 'core/hooks';
import { orgUnfollowed } from '../store';

export default function useFollowOrgMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const unfollowOrg = async () => {
    await apiClient.delete(`/api/users/me/following/${orgId}`);
    dispatch(orgUnfollowed(orgId));
  };

  return { unfollowOrg };
}
