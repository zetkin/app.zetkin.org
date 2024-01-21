'use server';

import BackendApiClient from 'core/api/client/BackendApiClient';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { redirect } from 'next/navigation';

export async function submit(formData: FormData) {
  const data = Object.fromEntries([...formData.entries()]);
  const submission = prepareSurveyApiSubmission(data, false);
  const apiClient = new BackendApiClient({});
  await apiClient.post(
    `/api/orgs/${data.orgId}/surveys/${data.surveyId}/submissions`,
    submission
  );
  redirect(`/o/${data.orgId}/surveys/${data.surveyId}/submitted`);
}
