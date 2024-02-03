import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import getSurveyStats, { SurveyStats } from '../rpc/getSurveyStats';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSurveyStats(
  orgId: number,
  surveyId: number
): IFuture<SurveyStats> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.surveys.statsBySurveyId[surveyId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(surveyId),
    actionOnSuccess: (stats) => statsLoaded([surveyId, stats]),
    loader: () => apiClient.rpc(getSurveyStats, { orgId, surveyId }),
  });
}
