import apiUrl from '../utils/apiUrl';

export interface ZetkinCampaign {
    info_text: string;
    title: string
}

export default function getCampaign(orgId : string, campId : string) {
    return async () : Promise<ZetkinCampaign> => {
        const cIdRes = await fetch(apiUrl(`/orgs/${orgId}/campaigns/${campId}`));
        const cIdData = await cIdRes.json();
        return cIdData.data;
    };
}