import { defaultFetch } from '../../../utils/fetching';
import { ZetkinEvent } from '../../../utils/types/zetkin';

export default function getUpcomingEvents(orgId: string, fetch = defaultFetch) {
  return async (): Promise<ZetkinEvent[]> => {
    const today = new Date(Date.now()).toISOString();
    const res = await fetch(
      `/orgs/${orgId}/actions?filter=start_time>${today}`
    );
    const resData = await res.json();
    return resData.data;
  };
}
