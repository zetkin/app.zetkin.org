import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { futureToObject, IFuture } from 'core/caching/futures';
import {
  submissionLoad,
  submissionLoaded,
  surveySubmissionUpdate,
  surveySubmissionUpdated,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  ZetkinSurveySubmission,
  ZetkinSurveySubmissionPatchBody,
} from 'utils/types/zetkin';

type UseSurveySubmissionReturn = IFuture<ZetkinSurveySubmission> & {
  setRespondentId: (id: number | null) => void;
};

export default function useSurveySubmission(
  orgId: number,
  submissionId: number
): UseSurveySubmissionReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const submissionItem = useAppSelector((state) =>
    state.surveys.submissionList.items.find((item) => item.id == submissionId)
  );

  const future = loadItemIfNecessary(submissionItem, dispatch, {
    actionOnLoad: () => submissionLoad(submissionId),
    actionOnSuccess: (data) => submissionLoaded(data),
    loader: () =>
      apiClient.get(`/api/orgs/${orgId}/survey_submissions/${submissionId}`),
  });

  return {
    ...futureToObject(future),
    setRespondentId(id) {
      dispatch(surveySubmissionUpdate([submissionId, ['respondent_id']]));
      apiClient
        .patch<ZetkinSurveySubmission, ZetkinSurveySubmissionPatchBody>(
          `/api/orgs/${orgId}/survey_submissions/${submissionId}`,
          {
            respondent_id: id,
          }
        )
        .then((submission) => {
          dispatch(surveySubmissionUpdated(submission));
        });
    },
  };
}
