import { defaultFetch } from '.';
import { ZetkinQuery } from 'utils/types/zetkin';

const getStandaloneQueries = (orgId: string, fetch = defaultFetch) => {
  return async (): Promise<ZetkinQuery[]> => {
    const res = await fetch(`/orgs/${orgId}/people/queries`);
    const body = await res.json();
    return body?.data;
  };
};

export default getStandaloneQueries;
