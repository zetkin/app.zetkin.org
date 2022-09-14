import defaultFetch from './defaultFetch';
import { ZetkinLocation } from '../types/zetkin';

export default function getLocations(orgId: string, fetch = defaultFetch) {
  return async (): Promise<ZetkinLocation[]> => {
    const res = await fetch(`/orgs/${orgId}/locations`);
    const resData = await res.json();
    return resData.data;
  };
}
