import { notFound } from 'next/navigation';

import { ZetkinSurveyExtended } from '../types/zetkin';
import { ApiClientError } from '../../core/api/errors';
import BackendApiClient from '../../core/api/client/BackendApiClient';

export default async function surveyFetch(
  apiClient: BackendApiClient,
  orgId: string,
  surveyId: string
): Promise<ZetkinSurveyExtended> {
  try {
    return await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    } else {
      throw e;
    }
  }
}
