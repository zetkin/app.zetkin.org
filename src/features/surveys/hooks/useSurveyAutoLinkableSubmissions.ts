import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import {
  autoLinkableSubmissionsLoad,
  autoLinkableSubmissionsLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import getAutoLinkableSubmissions, {
  AutoLinkableSubmissions,
} from 'features/surveys/rpc/getAutoLinkableSubmissions';

export default function useSurveyAutoLinkableSubmissions(
  orgId: number,
  surveyId: number
): IFuture<AutoLinkableSubmissions> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.surveys.autoLinkableSubmissionsBySurveyId[surveyId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => autoLinkableSubmissionsLoad(surveyId),
    actionOnSuccess: (submissions) =>
      autoLinkableSubmissionsLoaded([surveyId, submissions]),
    loader: () =>
      apiClient.rpc(getAutoLinkableSubmissions, { orgId, surveyId }),
  });
}
