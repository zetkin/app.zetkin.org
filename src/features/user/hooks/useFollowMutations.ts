import {
  followOrganizationLoad,
  followOrganizationLoaded,
} from 'features/user/store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseFollowMutationsReturn {
  followOrg: () => Promise<void>;
  unFollowOrg: () => Promise<void>;
}

export default function useFollowMutations(
  orgId: number
): UseFollowMutationsReturn {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const unFollowOrg = async () => {
    dispatch(followOrganizationLoad({ orgId }));
    await apiClient.delete(`/api/users/me/following/${orgId}`);
    dispatch(followOrganizationLoaded({ action: 'unfollow', orgId }));
  };

  const followOrg = async () => {
    dispatch(followOrganizationLoad({ orgId }));
    await apiClient.put(`/api/users/me/following/${orgId}`);
    dispatch(followOrganizationLoaded({ action: 'follow', orgId }));
  };

  return { followOrg, unFollowOrg };
}
