import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  responseStatsError,
  responseStatsLoad,
  responseStatsLoaded,
} from 'features/surveys/store';
import { Zetkin2SurveyInsights } from 'features/surveys/types';

export default function useSurveyInsights(
  orgId: number,
  surveyId: number
): IFuture<Zetkin2SurveyInsights> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.surveys.surveyInsightsBySurveyId[surveyId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnError: (err) => responseStatsError([surveyId, err]),
    actionOnLoad: () => responseStatsLoad(surveyId),
    actionOnSuccess: (stats) => responseStatsLoaded([surveyId, stats]),
    loader: () =>
      apiClient.get<Zetkin2SurveyInsights>(
        `/api2/orgs/${orgId}/surveys/${surveyId}/insights`
      ),
  });
}
