import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import getSurveyResponseStats, {
  SurveyResponseStats,
} from 'features/surveys/rpc/getSurveyResponseStats';
import {
  responseStatsError,
  responseStatsLoad,
  responseStatsLoaded,
} from 'features/surveys/store';

export default function useSurveyResponseStats(
  orgId: number,
  surveyId: number
): IFuture<SurveyResponseStats | null> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.surveys.responseStatsBySurveyId[surveyId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnError: (err) => responseStatsError([surveyId, err]),
    actionOnLoad: () => responseStatsLoad(surveyId),
    actionOnSuccess: (stats) => responseStatsLoaded([surveyId, stats]),
    loader: () => apiClient.rpc(getSurveyResponseStats, { orgId, surveyId }),
  });
}
