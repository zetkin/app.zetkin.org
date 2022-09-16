import defaultFetch from '../../../utils/fetching/defaultFetch';
import { ZetkinEvent } from '../../../utils/types/zetkin';

export default function postEvent(orgId: string, fetch = defaultFetch) {
  return async (action: Record<string, unknown>): Promise<ZetkinEvent> => {
    let url;
    if (action.campaign_id) {
      url = `/orgs/${orgId}/campaigns/${action.campaign_id}/actions`;
    } else {
      url = `/orgs/${orgId}/actions`;
    }
    const res = await fetch(url, {
      body: JSON.stringify(action),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const resData = await res.json();
    return resData;
  };
}
