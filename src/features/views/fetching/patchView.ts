import APIError from 'utils/apiError';
import defaultFetch from 'utils/fetching/defaultFetch';
import { ZetkinView } from 'utils/types/zetkin';

export default function patchView(
  orgId: string | number,
  viewId: string | number,
  fetch = defaultFetch
) {
  return async (view: Partial<ZetkinView>): Promise<ZetkinView> => {
    const url = `/orgs/${orgId}/people/views/${viewId}`;
    const res = await fetch(url, {
      body: JSON.stringify(view),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new APIError('PATCH', url);
    }
    const resBody = await res.json();
    return resBody.data;
  };
}
