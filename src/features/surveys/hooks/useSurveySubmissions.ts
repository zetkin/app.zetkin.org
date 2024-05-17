import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import { surveySubmissionsLoad, surveySubmissionsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSurveySubmissions(
  orgId: number,
  surveyId: number
): IFuture<ZetkinSurveySubmission[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const submissionList = useAppSelector(
    (state) => state.surveys.submissionList
  );

  return loadListIfNecessary(submissionList, dispatch, {
    actionOnLoad: () => surveySubmissionsLoad(surveyId),
    actionOnSuccess: (data) => surveySubmissionsLoaded([surveyId, data]),
    loader: () =>
      apiClient.get<ZetkinSurveySubmission[]>(
        `/api/orgs/${orgId}/surveys/${surveyId}/submissions`
      ),
  });
}
