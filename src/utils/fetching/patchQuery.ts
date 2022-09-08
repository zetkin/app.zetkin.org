import { defaultFetch } from '.';
import { ZetkinQuery } from 'utils/types/zetkin';

const patchQuery = (orgId: string, targetId: number, fetch = defaultFetch) => {
  return async (data: Record<string, unknown>): Promise<ZetkinQuery> => {
    const url = `/orgs/${orgId}/people/queries/${targetId}`;

    const res = await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
    const resData = await res.json();
    return resData?.data;
  };
};

export default patchQuery;
