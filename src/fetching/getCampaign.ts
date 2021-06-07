import { defaultFetch } from '.';
import { generateColors } from '../utils/generateColors';
import { ZetkinCampaign } from '../types/zetkin';


export default function getCampaign(orgId : string, campId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinCampaign> => {
        const cIdRes = await fetch(`/orgs/${orgId}/campaigns/${campId}`);
        const cIdData = await cIdRes.json();
        const dataWithColor = {
            ...cIdData, data: {
                ...cIdData.data, color: generateColors(cIdData.data.id.toString()),
            },
        };
        return dataWithColor.data;
    };
}