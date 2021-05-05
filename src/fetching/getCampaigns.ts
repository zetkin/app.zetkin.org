import apiUrl from '../utils/apiUrl';
import { ZetkinCampaign } from '../types/zetkin';

export default function getCampaigns(orgId : string) {
    return async () : Promise<ZetkinCampaign[]> => {
        const cRes = await fetch(apiUrl(`/orgs/${orgId}/campaigns`));
        const cData = await cRes.json();
        return cData.data;
    };
}
