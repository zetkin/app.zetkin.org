import { PromiseFuture } from 'core/caching/futures';
import { ZetkinView } from '../components/types';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { viewDeleted, viewUpdate, viewUpdated } from '../store';

type ZetkinViewUpdateBody = Partial<Omit<ZetkinView, 'id' | 'folder'>> & {
  folder_id?: number | null;
};

interface UseViewMutationsReturn {
  deleteView: (viewId: number) => void;
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

  return { deleteView, updateView };
}
