import getSurveyStats, { SurveyStats } from '../rpc/getSurveyStats';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useSurveyStats(
  orgId: number,
  surveyId: number
): SurveyStats {
  const apiClient = useApiClient();
  const statsItem = useAppSelector(
    (state) => state.surveys.statsBySurveyId[surveyId]
  );

  return useRemoteItem(statsItem, {
    actionOnLoad: () => statsLoad(surveyId),
    actionOnSuccess: (stats) => statsLoaded([surveyId, stats]),
    cacheKey: `survey-stats-${orgId}-${surveyId}`,
    loader: () => apiClient.rpc(getSurveyStats, { orgId, surveyId }),
  });
}
