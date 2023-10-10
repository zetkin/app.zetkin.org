import createNew from '../rpc/createNew/client';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinView } from '../components/types';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import {
  useApiClient,
  useAppDispatch,
  useAppSelector,
  useEnv,
} from 'core/hooks';
import {
  viewCreate,
  viewCreated,
  viewDeleted,
  viewLoad,
  viewLoaded,
  viewUpdate,
  viewUpdated,
} from '../store';

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
  ) => PromiseFuture<ZetkinView>;
  viewFuture: IFuture<ZetkinView>;
}

export default function useView(orgId: number, viewId?: number): UseViewReturn {
  const apiClient = useApiClient();
  const env = useEnv();
  const dispatch = useAppDispatch();
  const views = useAppSelector((state) => state.views);
  const item = views.viewList.items.find((item) => item.id == viewId);

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

  const viewFuture = loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => viewLoad(viewId!),
    actionOnSuccess: (view) => viewLoaded(view),
    loader: () => apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}`),
  });
  return { createView, deleteView, updateView, viewFuture };
}
