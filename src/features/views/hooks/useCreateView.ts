import createNew from '../rpc/createNew/client';
import { ZetkinView } from '../components/types';
import { useApiClient, useAppDispatch, useEnv } from 'core/hooks';
import { viewCreate, viewCreated } from '../store';

export default function useCreateView(
  orgId: number
): (folderId?: number, rows?: number[]) => void {
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

  return createView;
}
