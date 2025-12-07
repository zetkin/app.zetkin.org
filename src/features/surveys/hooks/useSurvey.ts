import { IFuture, ResolvedFuture } from 'core/caching/futures';
import { surveyLoad, surveyLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';
import { ZetkinSurvey, ZetkinSurveyExtended } from 'utils/types/zetkin';

type UseSurveyReturn = IFuture<ZetkinSurvey>;

export default function useSurvey(
  orgId: number,
  surveyId: number
): UseSurveyReturn {
  const apiClient = useApiClient();
  const surveyItem = useAppSelector((state) =>
    state.surveys.surveyList.items.find((item) => item.id == surveyId)
  );

  const survey = useRemoteItem(surveyItem, {
    actionOnLoad: () => surveyLoad(surveyId),
    // Although the list can contain normal survey objects, the act of loading
    // a single survey always result in the "extended" version (includes elements).
    actionOnSuccess: (data) => surveyLoaded(data as ZetkinSurveyExtended),
    cacheKey: `survey-${orgId}-${surveyId}`,
    loader: () =>
      apiClient.get<ZetkinSurveyExtended>(
        `/api/orgs/${orgId}/surveys/${surveyId}`
      ),
  });

  return new ResolvedFuture(survey);
}
