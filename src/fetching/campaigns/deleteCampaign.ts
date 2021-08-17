import { defaultFetch } from '..';

const deleteCampaign = (orgId : string | number, campaignId: string | number, fetch = defaultFetch) => {
    return async (): Promise<void> => {
        const url = `/orgs/${orgId}/campaigns/${campaignId}`;
        await fetch(url, {
            method: 'DELETE',
        });
    };
};

export default deleteCampaign;
