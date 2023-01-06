import APIError from 'utils/apiError';
import { ZetkinViewColumn } from 'utils/types/zetkin';

import defaultFetch from 'utils/fetching/defaultFetch';

export default function patchViewColumnCell(
  orgId: string,
  viewId: string | number,
  personId: string | number,
  fetch = defaultFetch
) {
  return async (
    cell: Partial<{ id: number; value: boolean }>
  ): Promise<ZetkinViewColumn> => {
    const colId = cell.id;
    delete cell.id;

    const url = `/orgs/${orgId}/people/views/${viewId}/rows/${personId}/cells/${colId}`;
    const res = await fetch(url, {
      body: JSON.stringify(cell),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
    if (!res.ok) {
      throw new APIError('PATCH', url);
    }
    const resData = await res.json();
    return resData.data;
  };
}
