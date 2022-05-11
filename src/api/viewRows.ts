/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createDeleteHandler } from './utils/createHandlers';
import { defaultFetch } from 'fetching';
import handleResponseData from './utils/handleResponseData';
import { makeUseMutationOptions } from './utils/makeUseMutationOptions';
import { useMutation, useQueryClient } from 'react-query';
import { ZetkinPerson, ZetkinViewRow } from 'types/zetkin';

export const viewRowsResource = (orgId: number, viewId: string) => {
  const key = ['view', viewId, 'rows'];
  const rowsUrl = `/orgs/${orgId}/people/views/${viewId}/rows`;
  const queryClient = useQueryClient();

  return {
    useAdd: () => {
      const handler = async (
        personId: ZetkinPerson['id']
      ): Promise<ZetkinViewRow> => {
        const res = await defaultFetch(`${rowsUrl}/${personId}`, {
          method: 'PUT',
        });
        return handleResponseData(res, 'PUT');
      };

      return useMutation(
        handler,
        makeUseMutationOptions(queryClient, key, {
          onSuccess: (newRow) => {
            if (newRow) {
              // Add created row directly to view, to avoid waiting for entire collection to reload
              const prevRows: ZetkinViewRow[] =
                queryClient.getQueryData<ZetkinViewRow[]>(key) || [];
              const allRows = prevRows.concat([newRow as ZetkinViewRow]);
              queryClient.setQueryData(key, allRows);
            }
          },
        })
      );
    },
    useRemoveMany: () => {
      const handler = async (
        personIds: number[]
      ): Promise<{ deleted: (number | null)[]; failed: number[] }> => {
        const deleted = (
          await Promise.all(
            personIds.map((personId) =>
              createDeleteHandler(`${rowsUrl}`)(personId)
                .then(() => personId)
                .catch(() => null)
            )
          )
        ).filter((id) => !!id);

        return {
          deleted,
          failed: personIds.filter((id) => !deleted.includes(id)),
        };
      };

      return useMutation(
        handler,
        makeUseMutationOptions(queryClient, key, {
          onSuccess: async ({ deleted }) => {
            if (deleted?.length) {
              const prevRows: ZetkinViewRow[] =
                queryClient.getQueryData<ZetkinViewRow[]>(key) || [];
              const newRows = prevRows.filter(
                (row) => !deleted.includes(row?.id)
              );
              queryClient.setQueryData(key, newRows);
            }
          },
        })
      );
    },
  };
};
