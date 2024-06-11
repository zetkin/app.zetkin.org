import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJoinSubmission } from '../types';
import { submissionsLoad, submissionsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useJoinSubmissions(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.joinForms.submissionList);

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => submissionsLoad(),
    actionOnSuccess: (data) => submissionsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinJoinSubmission[]>(
        `/api/orgs/${orgId}/join_submissions`
      ),
  });
}
