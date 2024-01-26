'use server';

import BackendApiClient from 'core/api/client/BackendApiClient';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { ZetkinSurveyFormStatus } from 'utils/types/zetkin';

export async function submit(
  prevState: ZetkinSurveyFormStatus,
  formData: FormData
): Promise<ZetkinSurveyFormStatus> {
  const data = Object.fromEntries([...formData.entries()]);
  const submission = prepareSurveyApiSubmission(data, false);
  const apiClient = new BackendApiClient({});
  try {
    await apiClient.post(
      `/api/orgs/${data.orgId}/surveys/${data.surveyId}/submissions`,
      submission
    );
  } catch (e) {
    return 'error';
  }
  return 'submitted';
}
