import APIError from 'utils/apiError';
import { ZetkinView } from 'types/zetkin';

import { defaultFetch } from '..';

export interface ZetkinViewPostBody extends Pick<ZetkinView, 'title'> {
  description?: string;
  owner?: number;
  organization?: number;
}

export default function postView(orgId: string, fetch = defaultFetch) {
  return async (view: ZetkinViewPostBody): Promise<ZetkinView> => {
    const url = `/orgs/${orgId}/people/views`;
    const res = await fetch(url, {
      body: JSON.stringify(view),
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
