import { useQuery, UseQueryResult } from 'react-query';

import { defaultFetch } from '.';
import { ZetkinQuery } from 'types/zetkin';

export default function getStandaloneQueries (orgId : string, fetch = defaultFetch) {
    return async ():Promise<ZetkinQuery[]> => {
        const res = await fetch(`/orgs/${orgId}/people/queries`);
        const body = await res.json();
        return body?.data;
    };
}

export const getStandaloneQueriesQueryKey = (orgId: string): ['standaloneQueries', string] => ['standaloneQueries', orgId];

export const useGetStandaloneQueries = (orgId: string): UseQueryResult<ZetkinQuery[]> => {
    return useQuery(getStandaloneQueriesQueryKey(orgId), getStandaloneQueries(orgId));
};