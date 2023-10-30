import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { PersonOrgData, personOrgsLoad, personOrgsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePersonOrgData(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const orgDataItem = useAppSelector(
    (state) => state.profiles.orgsByPersonId[personId]
  );
  return loadItemIfNecessary(orgDataItem, dispatch, {
    actionOnLoad: () => personOrgsLoad(personId),
    actionOnSuccess: (orgs) => personOrgsLoaded([personId, orgs]),
    loader: () =>
      apiClient.get<PersonOrgData>(
        `/api/organize/${orgId}/people/${personId}/organizations`
      ),
  });
}
