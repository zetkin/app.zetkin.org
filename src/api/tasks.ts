/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ZetkinTaskRequestBody } from 'types/tasks';
import { createMutation, createPrefetch, createUseQuery } from './utils/resourceHookFactories';

import { ZetkinTask } from '../types/zetkin';

export const useTasksResource = (orgId: string) => {

    const key = ['tasks', orgId];
    const url = `/orgs/${orgId}/tasks`;

    return {
        prefetch: createPrefetch(
            key,
            url,
        ),

        useCreate: createMutation<ZetkinTaskRequestBody, ZetkinTask>(
            key,
            url,
        ),

        useQuery: createUseQuery<ZetkinTask[]>(
            key,
            url,
        ),
    };
};


export const useCampaignTasksResource = (orgId: string, campaignId: string) => {

    const key = ['tasks', orgId, campaignId];
    const url = `/orgs/${orgId}/campaigns/${campaignId}/tasks`;

    return {
        prefetch: createPrefetch(
            key,
            url,
        ),

        useQuery: createUseQuery<ZetkinTask[]>(
            key,
            url,
        ),
    };
};

export const useTaskResource = (orgId: string, taskId: string) => {
    const key = ['task', taskId];
    const url = `/orgs/${orgId}/tasks/${taskId}`;

    return {
        prefetch: createPrefetch<ZetkinTask>(
            key,
            url,
        ),

        useDelete: createMutation<never, never>(
            key,
            url,
            {
                method: 'DELETE',
            },
        ),

        useQuery: createUseQuery<ZetkinTask>(
            key,
            url,
        ),

        useUpdate: createMutation<ZetkinTaskRequestBody, ZetkinTask>(
            key,
            url,
            {
                method: 'PATCH',
            },
        ),
    };
};