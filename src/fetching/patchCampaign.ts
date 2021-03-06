import { defaultFetch } from '.';
import { ZetkinCampaign } from '../types/zetkin';

export default function patchCampaign(orgId: string, campId: string, fetch = defaultFetch) {
    return async (campaign: Record<string, unknown>):Promise<ZetkinCampaign> => {
        const url = `/orgs/${orgId}/campaigns/${campId}`;
        const res = await fetch(url, {
            body: JSON.stringify(campaign),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        });
        const resData = await res.json();
        return resData;
    };
}
