import {
  ZetkinSurveyApiSubmission,
  ZetkinSurveyFormStatus,
} from 'utils/types/zetkin';
import { useApiClient } from 'core/hooks';

export default function useSurveySubmissionMutations(
  orgId: number,
  surveyId: number
) {
  const apiClient = useApiClient();

  const addSubmission = (
    formData: ZetkinSurveyApiSubmission
  ): Promise<ZetkinSurveyFormStatus> => {
    return apiClient.post(
      `/api/orgs/${orgId}/surveys/${surveyId}/submissions`,
      formData
    );
  };

  return { addSubmission };
}
