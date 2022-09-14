import defaultFetch from '../../../utils/fetching/defaultFetch';
import { ZetkinSurvey } from '../../../utils/types/zetkin';

export default function getSurvey(
  orgId: string,
  surveyId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinSurvey> => {
    const res = await fetch(`/orgs/${orgId}/surveys/${surveyId}`);
    const body = await res.json();
    return body?.data;
  };
}
