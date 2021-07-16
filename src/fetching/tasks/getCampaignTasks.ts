import { defaultFetch } from '..';
import { ZetkinTask } from '../../types/zetkin';

export default function getCampaignTasks(orgId : string, campaignId: string, fetch = defaultFetch) {
    return async () : Promise<ZetkinTask[]> => {
        const res = await fetch(`/orgs/${orgId}/campaigns/${campaignId}/tasks`);
        const body = await res.json();
        return body?.data;
    };
}
