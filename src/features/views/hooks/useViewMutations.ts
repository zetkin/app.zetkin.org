import Router from 'next/router';

import { PromiseFuture } from 'core/caching/futures';
import { ZetkinView } from '../components/types';
import {
  columnOrderUpdated,
  viewDeleted,
  viewUpdate,
  viewUpdated,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type ZetkinViewUpdateBody = Partial<Omit<ZetkinView, 'id' | 'folder'>> & {
  folder_id?: number | null;
};

interface UseViewMutationsReturn {
  deleteView: (viewId: number) => void;
  updateColumnOrder: (viewId: number, columnOrder: number[]) => Promise<void>;
  updateView: (
    viewId: number,
    data: ZetkinViewUpdateBody
  ) => PromiseFuture<ZetkinView>;
}

export default function useViewMutations(
  orgId: number
): UseViewMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deleteView = async (viewId: number): Promise<void> => {
    await apiClient.delete(`/api/orgs/${orgId}/people/views/${viewId}`);
    Router.push(`/organize/${orgId}/people`);
    dispatch(viewDeleted(viewId));
  };

  const updateView = (viewId: number, data: ZetkinViewUpdateBody) => {
    const mutating = Object.keys(data);
    dispatch(viewUpdate([viewId, mutating]));
    const promise = apiClient
      .patch<ZetkinView>(`/api/orgs/${orgId}/people/views/${viewId}`, data)
      .then((view) => {
        dispatch(viewUpdated([view, mutating]));
        return view;
      });

    return new PromiseFuture(promise);
  };

  const updateColumnOrder = async (
    viewId: number,
    columnOrder: number[]
  ): Promise<void> => {
    await apiClient.patch<{ order: number[] }>(
      `/api/orgs/${orgId}/people/views/${viewId}/column_order`,
      { order: columnOrder }
    );
    dispatch(columnOrderUpdated([viewId, columnOrder]));
  };

  return { deleteView, updateColumnOrder, updateView };
}
