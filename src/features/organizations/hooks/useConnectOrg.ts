import { useApiClient, useAppDispatch } from 'core/hooks';
import { userMembershipsLoaded } from '../store';
import { ZetkinMembership, ZetkinPersonNativeFields } from 'utils/types/zetkin';
import useFollowOrgMutations from './useFollowOrgMutations';

export default function useConnectOrg(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { followOrg } = useFollowOrgMutations(orgId);

  const connectOrg = async () => {
    const person = await apiClient.post<ZetkinPersonNativeFields>(
      `/api/orgs/${orgId}/join_requests`,
      {}
    );
    if (person.id) {
      const memberships = await apiClient.get<ZetkinMembership[]>(
        `/api/users/me/memberships`
      );
      dispatch(userMembershipsLoaded(memberships));
      if (memberships) {
        const newMembership =
          memberships.find(
            (membership) => membership.organization.id == orgId
          ) || null;
        if (newMembership) {
          followOrg(newMembership);
        }
      }
    }
  };

  return { connectOrg };
}
