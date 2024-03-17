import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinSurvey } from 'utils/types/zetkin';
import { surveysLoad, surveysLoaded } from 'features/surveys/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSurveys(orgId: number): IFuture<ZetkinSurvey[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const surveyList = useAppSelector((state) => state.surveys.surveyList);

  const surveys = loadListIfNecessary(surveyList, dispatch, {
    actionOnLoad: () => surveysLoad(),
    actionOnSuccess: (surveys) => surveysLoaded(surveys),
    loader: () => apiClient.get<ZetkinSurvey[]>(`/api/orgs/${orgId}/surveys`),
  });

  return surveys;
}
