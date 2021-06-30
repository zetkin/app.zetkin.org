import { defaultFetch } from '.';
import { ZetkinLocation } from '../types/zetkin';

export default function getCampaigns(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinLocation[]> => {
        const res = await fetch(`/orgs/${orgId}/locations`);
        const resData = await res.json();
        return resData.data;
    };
}
