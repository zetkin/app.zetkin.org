import APIError from 'utils/apiError';
import { ZetkinViewColumn } from 'utils/types/zetkin';

import defaultFetch from 'utils/fetching/defaultFetch';

export default function postViewColumn(
  orgId: string,
  viewId: string | number,
  fetch = defaultFetch
) {
  return async (
    columns: Omit<ZetkinViewColumn, 'id'>
  ): Promise<ZetkinViewColumn> => {
    const url = `/orgs/${orgId}/people/views/${viewId}/columns`;
    const res = await fetch(url, {
      body: JSON.stringify(columns),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    if (!res.ok) {
      throw new APIError('POST', url);
    }
    const resData = await res.json();
    return resData.data;
  };
}
