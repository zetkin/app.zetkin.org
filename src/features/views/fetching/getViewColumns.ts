import APIError from 'utils/api/apiError';
import { defaultFetch } from '..';
import { ZetkinViewColumn } from 'utils/types/zetkin';

export default function getViewColumns(
  orgId: string,
  viewId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinViewColumn[]> => {
    const url = `/orgs/${orgId}/people/views/${viewId}/columns`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new APIError('GET', url);
    }
    const resData = await res.json();
    return resData.data;
  };
}
