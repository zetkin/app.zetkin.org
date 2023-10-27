import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { surveyLoad, surveyLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
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
  const dispatch = useAppDispatch();

  const future = loadItemIfNecessary(surveyItem, dispatch, {
    actionOnLoad: () => surveyLoad(surveyId),
    // Although the list can contain normal survey objects, the act of loading
    // a single survey always result in the "extended" version (includes elements).
    actionOnSuccess: (data) => surveyLoaded(data as ZetkinSurveyExtended),
    loader: () =>
      apiClient.get<ZetkinSurveyExtended>(
        `/api/orgs/${orgId}/surveys/${surveyId}`
      ),
  });

  return future;
}
