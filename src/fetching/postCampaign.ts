import { defaultFetch } from '.';
import { ZetkinCampaign } from '../types/zetkin';

export default function postCampaign(orgId : string, fetch = defaultFetch) {
    return async (campaign: Record<string, unknown>):Promise<ZetkinCampaign> => {
        const url = `/orgs/${orgId}/campaigns`;
        const res = await fetch(url, {
            body: JSON.stringify(campaign),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        const resData = await res.json();
        return resData?.data;
    };
}
