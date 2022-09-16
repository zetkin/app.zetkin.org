import APIError from 'utils/apiError';
import defaultFetch from 'utils/fetching/defaultFetch';
import { ZetkinViewRow } from 'utils/types/zetkin';

export default function getViewRows(
  orgId: string,
  viewId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinViewRow[]> => {
    const url = `/orgs/${orgId}/people/views/${viewId}/rows`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new APIError('GET', url);
    }
    const resData = await res.json();
    return resData.data;
  };
}
