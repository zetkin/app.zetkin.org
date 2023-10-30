import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { futureToObject, IFuture } from 'core/caching/futures';
import {
  personOrgAdded,
  PersonOrgData,
  personOrgRemoved,
  personOrgsLoad,
  personOrgsLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type UsePersonOrgDataReturn = IFuture<PersonOrgData> & {
  addToOrg: (targetOrgId: number) => Promise<void>;
  removeFromOrg: (targetOrgId: number) => Promise<void>;
};

export default function usePersonOrgData(
  orgId: number,
  personId: number
): UsePersonOrgDataReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const orgDataItem = useAppSelector(
    (state) => state.profiles.orgsByPersonId[personId]
  );

  const future = loadItemIfNecessary(orgDataItem, dispatch, {
    actionOnLoad: () => personOrgsLoad(personId),
    actionOnSuccess: (orgs) => personOrgsLoaded([personId, orgs]),
    loader: () =>
      apiClient.get<PersonOrgData>(
        `/api/organize/${orgId}/people/${personId}/organizations`
      ),
  });

  const addToOrg = async (targetOrgId: number) => {
    await apiClient.put(
      `/api/orgs/${orgId}/people/${personId}/connections/${targetOrgId}`
    );
    dispatch(personOrgAdded(personId));
  };

  const removeFromOrg = async (targetOrgId: number) => {
    await apiClient.delete(
      `/api/orgs/${orgId}/people/${personId}/connections/${targetOrgId}`
    );
    dispatch(personOrgRemoved(personId));
  };

  return {
    ...futureToObject(future),
    addToOrg,
    removeFromOrg,
  };
}
