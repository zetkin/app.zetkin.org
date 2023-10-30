import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinPerson } from 'utils/types/zetkin';
import { personLoad, personLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePerson(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.profiles.personById[personId]);
  return loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => personLoad(personId),
    actionOnSuccess: (data) => personLoaded([personId, data]),
    loader: () =>
      apiClient.get<ZetkinPerson>(`/api/orgs/${orgId}/people/${personId}`),
  });
}
