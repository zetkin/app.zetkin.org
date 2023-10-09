import createNew from '../rpc/createNew/client';
import { PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useEnv } from 'core/hooks';
import {
  viewCreate,
  viewCreated,
  viewDeleted,
  viewUpdate,
  viewUpdated,
} from '../store';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

type ZetkinViewUpdateBody = Partial<Omit<ZetkinView, 'id' | 'folder'>> & {
  folder_id?: number | null;
};

interface UseViewReturn {
  createView: (folderId?: number, rows?: number[]) => void;
  deleteView: (viewId: number) => void;
  updateView: (
    orgId: number,
    viewId: number,
    data: ZetkinViewUpdateBody
  ) => PromiseFuture<ZetkinViewFolder>;
}

export default function useView(orgId: number): UseViewReturn {
  const apiClient = useApiClient();
  const env = useEnv();
  const dispatch = useAppDispatch();

  const createView = async (
    folderId = 0,
    rows: number[] = []
  ): Promise<ZetkinView> => {
    dispatch(viewCreate());
    const view = await apiClient.rpc(createNew, {
      folderId,
      orgId,
      rows,
    });
    dispatch(viewCreated(view));
    env.router.push(
      `/organize/${view.organization.id}/people/lists/${view.id}`
    );
    return view;
  };

  const deleteView = async (viewId: number): Promise<void> => {
    await apiClient.delete(`/api/orgs/${orgId}/people/views/${viewId}`);
    dispatch(viewDeleted(viewId));
  };

  const updateView = (
    orgId: number,
    viewId: number,
    data: ZetkinViewUpdateBody
  ) => {
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

  return { createView, deleteView, updateView };
}
