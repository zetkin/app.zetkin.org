import APIError from 'utils/apiError';
import { ZetkinViewColumn } from 'types/zetkin';

import { defaultFetch } from '..';

export default function putViewRow(
  orgId: string,
  viewId: string | number,
  fetch = defaultFetch
) {
  return async (personId: string | number): Promise<ZetkinViewColumn> => {
    const url = `/orgs/${orgId}/people/views/${viewId}/rows/${personId}`;
    const res = await fetch(url, {
      method: 'PUT',
    });
    if (!res.ok) {
      throw new APIError('PUT', url);
    }
    const resData = await res.json();
    return resData.data;
  };
}
