import defaultFetch from '../../../utils/fetching/defaultFetch';
import { ZetkinCampaign } from 'utils/types/zetkin';

export default function patchCampaign(
  orgId: string | number,
  campId: string | number,
  fetch = defaultFetch
) {
  return async (campaign: Record<string, unknown>): Promise<ZetkinCampaign> => {
    const url = `/orgs/${orgId}/campaigns/${campId}`;
    const res = await fetch(url, {
      body: JSON.stringify(campaign),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new Error(`Error making PATCH request to ${url}`);
    }
    const resData = await res.json();
    return resData;
  };
}
