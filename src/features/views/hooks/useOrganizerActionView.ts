import getOrgActionView from '../rpc/getOrganizerActionView/client';
import { ZetkinView } from '../components/types';
import { useApiClient, useAppDispatch, useEnv } from 'core/hooks';
import { viewCreate, viewCreated } from '../store';

export default function useOrganizerActionView(
  orgId: number
): () => Promise<ZetkinView> {
  const apiClient = useApiClient();
  const env = useEnv();
  const dispatch = useAppDispatch();

  const getOrganizerActionView = async () => {
    dispatch(viewCreate());
    const view = await apiClient.rpc(getOrgActionView, {
      orgId,
    });
    dispatch(viewCreated(view));
    env.router.push(
      `/organize/${view.organization.id}/people/lists/${view.id}`
    );
    return view;
  };

  return getOrganizerActionView;
}
