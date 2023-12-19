import getOrgActionView from '../rpc/getOrganizerActionView/client';
import { useRouter } from 'next/router';
import { ZetkinView } from '../components/types';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { viewCreate, viewCreated } from '../store';

export default function useOrganizerActionView(
  orgId: number
): () => Promise<ZetkinView> {
  const apiClient = useApiClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const getOrganizerActionView = async () => {
    dispatch(viewCreate());
    const view = await apiClient.rpc(getOrgActionView, {
      orgId,
    });
    dispatch(viewCreated(view));
    router.push(`/organize/${view.organization.id}/people/lists/${view.id}`);
    return view;
  };

  return getOrganizerActionView;
}
