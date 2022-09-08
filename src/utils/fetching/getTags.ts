import { defaultFetch } from '.';
import { ZetkinTag } from '../types/zetkin';

const getTags = (orgId: string, fetch = defaultFetch) => {
  return async (): Promise<ZetkinTag[]> => {
    const res = await fetch(`/orgs/${orgId}/people/tags`);
    const body = await res.json();
    return body?.data;
  };
};

export default getTags;
