import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import {
  followOrganizationLoad,
  followOrganizationLoaded,
} from 'features/user/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

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
    dispatch(followOrganizationLoaded({ orgId, action: 'unfollow' }));
  };

  const followOrg = async () => {
    dispatch(followOrganizationLoad({ orgId }));
    await apiClient.put(`/api/users/me/following/${orgId}`);
    dispatch(followOrganizationLoaded({ orgId, action: 'follow' }));
  };

  return { followOrg, unFollowOrg };
}
