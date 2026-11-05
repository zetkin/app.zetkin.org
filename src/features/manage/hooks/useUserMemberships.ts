import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinMembership } from 'utils/types/zetkin';
import { serializeError } from 'utils/storeUtils/serializeError';
import {
  userMembershipsError,
  userMembershipsLoad,
  userMembershipsLoaded,
} from 'features/manage/store';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useUser(userId: number) {
  const apiClient = useApiClient();

  const membershipsList = useAppSelector(
    (state) => state.manage.membershipsByUserId[userId]
  );

  if (membershipsList?.error) {
    throw new Error(serializeError(membershipsList.error));
  }

  return useRemoteList(membershipsList, {
    actionOnError: (err) => userMembershipsError([userId, serializeError(err)]),
    actionOnLoad: () => userMembershipsLoad(userId),
    actionOnSuccess: (memberships) =>
      userMembershipsLoaded([userId, memberships]),
    loader: () =>
      apiClient.get<ZetkinMembership[]>(`/api/users/${userId}/memberships`),
  });
}
