import APIError from 'utils/apiError';
import { ZetkinViewColumn } from 'utils/types/zetkin';

import defaultFetch from 'utils/fetching/defaultFetch';

export default function patchViewColumn(
  orgId: string,
  viewId: string | number,
  fetch = defaultFetch
) {
  return async (
    column: Partial<ZetkinViewColumn>
  ): Promise<ZetkinViewColumn> => {
    const colId = column.id;
    delete column.id;

    const url = `/orgs/${orgId}/people/views/${viewId}/columns/${colId}`;
    const res = await fetch(url, {
      body: JSON.stringify(column),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new APIError('PATCH', url);
    }
    const resData = await res.json();
    return resData.data;
  };
}
