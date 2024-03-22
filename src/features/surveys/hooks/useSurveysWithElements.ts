import { loadListIfNecessary } from 'core/caching/cacheUtils';
import useSurveys from './useSurveys';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { IFuture, LoadingFuture } from 'core/caching/futures';
import {
  surveysWithElementsLoad,
  surveysWithElementsLoaded,
} from 'features/surveys/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSurveysWithElements(
  orgId: number
): IFuture<ZetkinSurveyExtended[]> {
  const surveys = useSurveys(orgId);
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const surveysLists = useAppSelector(
    (state) => state.surveys.surveysWithElementsList
  );

  const surveysData = surveys.data;

  if (surveys.isLoading || !surveysData) {
    return new LoadingFuture();
  }

  const listaDeSurveys = loadListIfNecessary(surveysLists, dispatch, {
    actionOnLoad: () => surveysWithElementsLoad(),
    actionOnSuccess: (surveysAndElements) =>
      surveysWithElementsLoaded(surveysAndElements),
    loader: () => {
      return Promise.all(
        surveysData.map((survey) =>
          apiClient.get<ZetkinSurveyExtended>(
            `/api/orgs/${orgId}/surveys/${survey.id}`
          )
        )
      );
    },
  });
  return listaDeSurveys;
}
