import { defaultFetch } from '.';
import { ZetkinCampaign } from '../types/zetkin';

export default function getUserCampaigns(fetch = defaultFetch) {
    return async () : Promise<ZetkinCampaign[]> => {
        const fRes = await fetch(`/users/me/following`);
        const fData = await fRes.json();

        const userCampaignsData = [];

        if (fData.data) {
            for (const fObj of fData.data) {
                const cRes = await fetch(`/orgs/${fObj.organization.id}/campaigns`);
                const cData = await cRes.json();

                const org = {
                    id: fObj.organization.id,
                    title: fObj.organization.title,
                };

                if (cData.data && cData.data.length > 0) {
                    for (const cObj of cData.data) {
                        userCampaignsData.push({ ...cObj, organization: org });
                    }
                }
            }
        }
        return userCampaignsData;
    };
}