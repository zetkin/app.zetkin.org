import { defaultFetch } from '.';
import { ZetkinJourney } from '../types/zetkin';

export default function getJourneys(orgId: string, fetch = defaultFetch) {
  return async (): Promise<ZetkinJourney[]> => {
    const journeysRes = await fetch(`/orgs/${orgId}/journeys`);
    const journeysBody = await journeysRes.json();
    return journeysBody?.data;
  };
}
