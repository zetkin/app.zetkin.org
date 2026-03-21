import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { elementsLoad, elementsLoaded } from '../store';
import {
  futureToObject,
  IFuture,
  PlaceholderFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinSurveyElement, ZetkinSurveyExtended } from 'utils/types/zetkin';

type UseSurveyElementsReturn = IFuture<ZetkinSurveyElement[]> & {
  surveyIsEmpty: boolean;
};

export default function useSurveyElements(
  orgId: number,
  surveyId: number | null
): UseSurveyElementsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const elemList = useAppSelector((state) => state.surveys.elementsBySurveyId);

  if (!surveyId) {
    return {
      ...futureToObject(new PlaceholderFuture<ZetkinSurveyElement[]>([])),
      surveyIsEmpty: true,
    };
  }

  const future = loadListIfNecessary(elemList[surveyId], dispatch, {
    actionOnLoad: () => elementsLoad(surveyId),
    actionOnSuccess: (elements) => elementsLoaded([surveyId, elements]),
    loader: async () => {
      const survey = await apiClient.get<ZetkinSurveyExtended>(
        `/api/orgs/${orgId}/surveys/${surveyId}`
      );
      return survey.elements;
    },
  });

  return {
    ...futureToObject(future),
    surveyIsEmpty: !future.data || future.data.length == 0,
  };
}
