import { surveySubmissionUpdate, surveySubmissionUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinSurveySubmission,
  ZetkinSurveySubmissionPatchBody,
} from 'utils/types/zetkin';

type UseSurveySubmissionReturn = {
  setRespondentId: (id: number | null) => void;
};

export default function useSurveySubmission(
  orgId: number,
  submissionId: number
): UseSurveySubmissionReturn {
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
