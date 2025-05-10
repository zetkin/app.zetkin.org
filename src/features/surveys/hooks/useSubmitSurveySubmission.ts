import {
  ZetkinSurveyFormStatus,
  ZetkinSurveyQuestionResponse,
} from 'utils/types/zetkin';
import { useApiClient } from 'core/hooks';

export type ZetkinSurveyCallSubmission = {
  responses: ZetkinSurveyQuestionResponse[];
  signature: number;
};

export default function useSubmitSurveySubmission(
  orgId: number,
  surveyId: number
) {
  const apiClient = useApiClient();

  const submitSurveySubmission = (
    formData: ZetkinSurveyCallSubmission
  ): Promise<ZetkinSurveyFormStatus> => {
    return apiClient.post(
      `/api/orgs/${orgId}/surveys/${surveyId}/submissions`,
      formData
    );
  };

  return { submitSurveySubmission };
}
