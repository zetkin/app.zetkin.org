import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { userMembershipsLoad, userMembershipsLoaded } from '../store';
import { ZetkinMembership, ZetkinMembershipListData } from 'utils/types/zetkin';

const useMemberships = (): IFuture<ZetkinMembershipListData[] | null> => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const organizationState = useAppSelector((state) => state.organizations);

  const organizations = loadListIfNecessary(
    organizationState.userMembershipList,
    dispatch,
    {
      actionOnLoad: () => userMembershipsLoad(),
      actionOnSuccess: (data) => userMembershipsLoaded(data),
      loader: () =>
        apiClient
          .get<ZetkinMembership[]>(`/api/users/me/memberships`)
          .then((response) => response.filter((m) => m.role != null))
          .then((filteredResponse) =>
            filteredResponse.map((item) => {
              return {
                ...item,
                id: item.organization.id,
                title: item.organization.title,
              };
            })
          ),
    }
  );

  return organizations;
};

export default useMemberships;
