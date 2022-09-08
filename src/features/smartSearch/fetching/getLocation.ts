import { defaultFetch } from '../../../utils/fetching';
import { ZetkinLocation } from '../../../utils/types/zetkin';

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
