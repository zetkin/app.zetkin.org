import { useQuery, UseQueryResult } from 'react-query';

import { defaultFetch } from '.';
import { ZetkinTag } from '../types/zetkin';

export const getTags = (orgId : string, fetch = defaultFetch) => {
    return async (): Promise<ZetkinTag[]> => {
        const res = await fetch(`/orgs/${orgId}/people/tags`);
        const body = await res.json();
        return body?.data;
    };
};

export const getTagsQueryKey = (orgId: string): ['tasks', string] => ['tasks', orgId];

export const useGetTags = (orgId: string): UseQueryResult<ZetkinTag[]> => {
    return useQuery(getTagsQueryKey(orgId), getTags(orgId));
};

export default getTags;