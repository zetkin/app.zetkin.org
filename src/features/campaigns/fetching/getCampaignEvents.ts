import defaultFetch from '../../../utils/fetching/defaultFetch';
import { ZetkinEvent } from '../../../utils/types/zetkin';

export default function getCampaignEvents(
  orgId: string,
  campId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinEvent[]> => {
    const eventsRes = await fetch(`/orgs/${orgId}/campaigns/${campId}/actions`);
    const eventsBody = await eventsRes.json();
    return eventsBody?.data;
  };
}
