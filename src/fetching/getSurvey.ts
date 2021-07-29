import { defaultFetch } from '.';
import { ZetkinSurvey } from '../types/zetkin';

export default function getSurvey(orgId : string, surveyId: string, fetch = defaultFetch) {
    return async (): Promise<ZetkinSurvey> => {
        const res = await fetch(`/orgs/${orgId}/surveys/${surveyId}`);
        const body = await res.json();
        return body?.data;
    };
}
