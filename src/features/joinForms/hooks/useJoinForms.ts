import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJoinForm } from '../types';
import { joinFormsLoad, joinFormsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useJoinForms(orgId: number): IFuture<ZetkinJoinForm[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const formList = useAppSelector((state) => state.joinForms.formList);

  return loadListIfNecessary(formList, dispatch, {
    actionOnLoad: () => joinFormsLoad(),
    actionOnSuccess: (data) => joinFormsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinJoinForm[]>(`/api/orgs/${orgId}/join_forms`),
  });
}
