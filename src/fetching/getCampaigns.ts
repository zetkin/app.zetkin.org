import { defaultFetch } from '.';
import { generateColors } from '../utils/generateColors';
import { ZetkinCampaign } from '../types/zetkin';

export default function getCampaigns(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinCampaign[]> => {
        const cRes = await fetch(`/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();
        const dataWithColor = { ...cData, data: cData.data.map((c: ZetkinCampaign) => {
            return { ...c, color: generateColors(c.id.toString()) };
        }) };
        return dataWithColor.data;
    };
}
