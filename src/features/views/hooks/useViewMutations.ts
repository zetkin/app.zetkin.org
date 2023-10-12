import createNew from '../rpc/createNew/client';
import { ZetkinView } from '../components/types';
import { PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useEnv } from 'core/hooks';
import {
  viewCreate,
  viewCreated,
  viewDeleted,
  viewUpdate,
  viewUpdated,
} from '../store';

type ZetkinViewUpdateBody = Partial<Omit<ZetkinView, 'id' | 'folder'>> & {
  folder_id?: number | null;
};

interface UseViewMutationsReturn {
  createView: (folderId?: number, rows?: number[]) => void;
  deleteView: (viewId: number) => void;
  setTitle: (viewId: number, title: string) => void;
  updateView: (
    viewId: number,
    data: ZetkinViewUpdateBody
  ) => PromiseFuture<ZetkinView>;
}

export default function useViewMutations(
  orgId: number
): UseViewMutationsReturn {
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

  const setTitle = (viewId: number, title: string) => {
    updateView(viewId, { title });
  };
  return { createView, deleteView, setTitle, updateView };
}
