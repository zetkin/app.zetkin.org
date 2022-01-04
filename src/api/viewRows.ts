/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { defaultFetch } from 'fetching';
import handleResponseData from './utils/handleResponseData';
import { makeUseMutationOptions } from './utils/resourceHookFactories';
import { useMutation, useQueryClient } from 'react-query';
import { ZetkinPerson, ZetkinViewRow } from 'types/zetkin';


export const viewRowsResource = (orgId: number, viewId: string) => {
    const key = ['view', viewId, 'rows'];
    const rowsUrl = `/orgs/${orgId}/people/views/${viewId}/rows`;

    return {
        useAdd: () => {
            const queryClient = useQueryClient();

            const handler = async (personId: ZetkinPerson['id']): Promise<ZetkinViewRow> => {
                const res = await defaultFetch(`${rowsUrl}/${personId}`, {
                    method: 'PUT',
                });
                return handleResponseData(res, 'PUT');
            };

            return useMutation(handler, makeUseMutationOptions(queryClient, key, {
                onSuccess: (newRow) => {
                    if (newRow) {
                        // Add created row directly to view, to avoid waiting for entire collection to reload
                        const prevRows: ZetkinViewRow[] = queryClient.getQueryData<ZetkinViewRow[]>(key) || [];
                        const allRows = prevRows.concat([newRow as ZetkinViewRow]);
                        queryClient.setQueryData(key, allRows);
                    }
                },
            }));
        },
    };
};
