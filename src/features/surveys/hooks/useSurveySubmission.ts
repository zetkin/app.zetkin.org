import { useCallback } from 'react';

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

type UseSurveySubmissionResponderReturn = {
  setRespondentId: (id: number | null) => void;
};

type UseSurveySubmissionReturn = IFuture<ZetkinSurveySubmission> &
  UseSurveySubmissionResponderReturn;

export default function useSurveySubmission(
  orgId: number,
  submissionId: number
): UseSurveySubmissionReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { setRespondentId } = useSurveySubmissionResponder(orgId, submissionId);

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
    setRespondentId,
  };
}

export function useSurveySubmissionResponder(
  orgId: number,
  submissionId: number
): UseSurveySubmissionResponderReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
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

export function useSurveySubmissionBulkSetResponder(
  orgId: number
): (
  patches: { respondentId: number; submissionId: number }[]
) => Promise<void> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return useCallback(
    async (patches) => {
      patches.forEach(({ submissionId }) =>
        dispatch(surveySubmissionUpdate([submissionId, ['respondent_id']]))
      );

      const submissions = await Promise.all(
        patches.map(async ({ respondentId, submissionId }) => {
          return await apiClient.patch<
            ZetkinSurveySubmission,
            ZetkinSurveySubmissionPatchBody
          >(`/api/orgs/${orgId}/survey_submissions/${submissionId}`, {
            respondent_id: respondentId,
          });
        })
      );

      submissions.forEach((submission) =>
        dispatch(surveySubmissionUpdated(submission))
      );
    },
    [orgId, apiClient, dispatch]
  );
}
