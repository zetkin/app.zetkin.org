import { defaultFetch } from '../../../utils/fetching';
import { ZetkinActivity } from '../../../utils/types/zetkin';

export default function getActivity(
  orgId: string,
  activityId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinActivity> => {
    const res = await fetch(`/orgs/${orgId}/activities/${activityId}`);
    const resData = await res.json();
    return resData?.data;
  };
}
