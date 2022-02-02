import APIError from 'utils/apiError';

import { defaultFetch } from '..';

export default function deleteViewColumn(
  orgId: string,
  viewId: string | number,
  fetch = defaultFetch
) {
  return async (colId: string | number): Promise<void> => {
    const url = `/orgs/${orgId}/people/views/${viewId}/columns/${colId}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
      throw new APIError('DELETE', url);
    }
  };
}
