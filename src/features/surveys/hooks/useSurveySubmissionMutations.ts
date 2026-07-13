import { surveySubmissionDeleted } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useSurveySubmissionMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function deleteSurveySubmission(
    submissionId: number,
    surveyId: number
  ) {
    await apiClient.delete(
      `/api/orgs/${orgId}/survey_submissions/${submissionId}`
    );
    dispatch(surveySubmissionDeleted({ submissionId, surveyId }));
  }

  return {
    deleteSurveySubmission,
  };
}
