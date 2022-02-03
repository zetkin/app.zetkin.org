import { defaultFetch } from '.';
import { ZetkinEvent } from '../types/zetkin';

export default function getEvents(orgId: string, fetch = defaultFetch) {
  return async (): Promise<ZetkinEvent[]> => {
    const eventsRes = await fetch(`/orgs/${orgId}/actions`);
    const eventsBody = await eventsRes.json();
    return eventsBody?.data;
  };
}
