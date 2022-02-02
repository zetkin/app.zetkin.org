import { defaultFetch } from '.';
import { ZetkinLocation } from '../types/zetkin';

export default function getLocation(
  orgId: string,
  locationId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinLocation> => {
    const res = await fetch(`/orgs/${orgId}/locations/${locationId}`);
    const resData = await res.json();
    return resData?.data;
  };
}
