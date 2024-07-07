import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJoinForm } from '../types';
import { joinFormLoad, joinFormLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useJoinForm(orgId: number, formId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) =>
    state.joinForms.formList.items.find((item) => item.id == formId)
  );

  return loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => joinFormLoad(formId),
    actionOnSuccess: (data) => joinFormLoaded(data),
    loader: () =>
      apiClient.get<ZetkinJoinForm>(`/api/orgs/${orgId}/join_forms/${formId}`),
  });
}
