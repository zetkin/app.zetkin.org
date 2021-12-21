/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ZetkinTaskRequestBody } from 'types/tasks';
import { createMutation, createPrefetch, createUseQuery } from './utils/resourceHookFactories';

import { ZetkinTask } from '../types/zetkin';

export const useTasksResource = (orgId: string) => {

    const key = ['tasks', orgId];

    return {
        key,

        prefetch: createPrefetch(
            key,
            `/orgs/${orgId}/tasks`,
        ),

        useCreate: createMutation<ZetkinTaskRequestBody, ZetkinTask>(
            key,
            `/orgs/${orgId}/tasks`,
            {
                method: 'POST',
            },
        ),

        useQuery: createUseQuery<ZetkinTask[]>(
            key,
            `/orgs/${orgId}/tasks`,
        ),
    };
};


export const useCampaignTasksResource = (orgId: string, campaignId: string) => {

    const key = ['tasks', orgId, campaignId];

    return {
        key,

        prefetch: createPrefetch(
            key,
            `/orgs/${orgId}/campaigns/${campaignId}/tasks`,
        ),

        useQuery: createUseQuery<ZetkinTask[]>(
            key,
            `/orgs/${orgId}/campaigns/${campaignId}/tasks`,
        ),
    };
};
