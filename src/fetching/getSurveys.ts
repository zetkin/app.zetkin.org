import { defaultFetch } from '.';
import { ZetkinSurvey } from '../types/zetkin';

export default function getSurvey(orgId : string, fetch = defaultFetch) {
    return async (): Promise<ZetkinSurvey[]> => {
        const sIdRes = await fetch(`/orgs/${orgId}/surveys`);
        const sIdData = await sIdRes.json();
        return sIdData.data;
    };
}
