'use server';

import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import {
  ZetkinMembership,
  ZetkinSurveyFormStatus,
  ZetkinUser,
} from 'utils/types/zetkin';

export async function submit(
  prevState: ZetkinSurveyFormStatus,
  formData: FormData
): Promise<ZetkinSurveyFormStatus> {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const { orgId, surveyId } = Object.fromEntries([...formData.entries()]);

  let user: ZetkinUser | null;
  let isConnectedToOrg = false;
  try {
    let memberships: ZetkinMembership[] | null;
    [user, memberships] = await Promise.all([
      apiClient.get<ZetkinUser>('/api/users/me'),
      apiClient.get<ZetkinMembership[]>('/api/users/me/memberships'),
    ]);

    isConnectedToOrg = memberships.some(
      (membership) => membership.organization.id.toString() === orgId.toString()
    );
  } catch (e) {
    user = null;
  }

  const submission = prepareSurveyApiSubmission(
    formData,
    user,
    isConnectedToOrg
  );
  try {
    await apiClient.post(
      `/api/orgs/${orgId}/surveys/${surveyId}/submissions`,
      submission
    );
  } catch (e) {
    return 'error';
  }
  return 'submitted';
}
