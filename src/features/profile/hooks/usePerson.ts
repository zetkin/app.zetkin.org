import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinPerson } from 'utils/types/zetkin';
import { IFuture, ResolvedFuture } from 'core/caching/futures';
import { personLoad, personLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePerson(
  orgId: number,
  personId?: number
): IFuture<ZetkinPerson> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) =>
    personId === undefined ? undefined : state.profiles.personById[personId]
  );
  if (personId === undefined) {
    return new ResolvedFuture(null);
  }
  return loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => personLoad(personId),
    actionOnSuccess: (data) => personLoaded([personId, data]),
    loader: () =>
      apiClient.get<ZetkinPerson>(`/api/orgs/${orgId}/people/${personId}`),
  });
}
