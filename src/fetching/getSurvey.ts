import apiUrl from '../utils/apiUrl';
import { ZetkinSurvey } from '../types/zetkin';

export default function getSurvey(orgId : string, surId : string) {
    return async () : Promise<ZetkinSurvey> => {
        const sIdRes = await fetch(apiUrl(`/orgs/${orgId}/surveys/${surId}`));
        const sIdData = await sIdRes.json();
        return sIdData.data;
    };
}
