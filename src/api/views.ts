/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ZetkinView } from 'types/views';
import { createPrefetch, createUseQuery } from './utils/resourceHookFactories';

export const viewsResource = (orgId: string) => {
    const key = ['views', orgId];
    const url = `/orgs/${orgId}/people/views`;

    return {
        prefetch: createPrefetch<ZetkinView[]>(key, url),
        useQuery: createUseQuery<ZetkinView[]>(key, url),
    };
};
