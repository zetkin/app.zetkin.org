import { useApiClient, useAppDispatch } from 'core/hooks';
import { userMembershipsLoaded } from '../store';
import connectToOrg from 'features/organizations/rpc/connectToOrg';

export default function useConnectOrg(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const connectOrg = async () => {
    const result = await apiClient.rpc(connectToOrg, { orgId });

    if (result.memberships) {
      dispatch(userMembershipsLoaded(result.memberships));
    }
  };

  return { connectOrg };
}
