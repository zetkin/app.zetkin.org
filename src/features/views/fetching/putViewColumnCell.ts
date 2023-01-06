import APIError from 'utils/apiError';

import defaultFetch from 'utils/fetching/defaultFetch';
import { ZetkinViewCell } from '../components/types';

export default function patchViewColumnCell(
  orgId: string,
  viewId: string | number,
  personId: string | number,
  fetch = defaultFetch
) {
  return async (
    cellWithId: Partial<ZetkinViewCell> & { id: number }
  ): Promise<ZetkinViewCell> => {
    const { id: cellId, ...cell } = cellWithId;

    const url = `/orgs/${orgId}/people/views/${viewId}/rows/${personId}/cells/${cellId}`;
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
