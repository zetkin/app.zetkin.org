import { defaultFetch } from '.';
import { ZetkinCampaign } from '../types/zetkin';


export default function getCampaign(orgId : string, campId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinCampaign> => {
        const cIdRes = await fetch(`/orgs/${orgId}/campaigns/${campId}`);
        const cIdData = await cIdRes.json();
        return cIdData.data;
    };
}