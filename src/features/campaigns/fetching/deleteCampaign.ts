import defaultFetch from '../../../utils/fetching/defaultFetch';

const deleteCampaign = (
  orgId: string | number,
  campaignId: string | number,
  fetch = defaultFetch
) => {
  return async (): Promise<void> => {
    const url = `/orgs/${orgId}/campaigns/${campaignId}`;
    const res = await fetch(url, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Error making PATCH request to ${url}`);
    }
  };
};

export default deleteCampaign;
