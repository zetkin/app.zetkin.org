import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJoinSubmission } from '../types';
import { submissionLoad, submissionLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useJoinSubmission(orgId: number, submissionId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) =>
    state.joinForms.submissionList.items.find((item) => item.id == submissionId)
  );

  return loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => submissionLoad(submissionId),
    actionOnSuccess: (data) => submissionLoaded(data),
    loader: () =>
      apiClient.get<ZetkinJoinSubmission>(
        `/api/orgs/${orgId}/join_submissions/${submissionId}`
      ),
  });
}
