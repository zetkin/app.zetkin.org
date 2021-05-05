import { defaultFetch } from '.';
import { ZetkinCampaign } from '../types/zetkin';

export default function getCampaigns(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinCampaign[]> => {
        const cRes = await fetch(`/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();
        return cData.data;
    };
}
