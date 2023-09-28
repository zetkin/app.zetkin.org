import { ZetkinView } from '../components/types';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useEnv } from 'core/hooks';
import { useStore } from 'react-redux';
import { viewCreate, viewCreated } from '../store';
import getOrgActionView from '../rpc/getOrganizerActionView/client';

interface UseOrganizerActionViewReturn {
  organizerActionViewFuture: IFuture<ZetkinView>;
}

export default function useOrganizerActionView(
  orgId: number
): PromiseFuture<ZetkinView> {
  const apiClient = useApiClient();
  const env = useEnv();
  const store = useStore();

  const getOrganizerActionView = async () => {
    store.dispatch(viewCreate());
    const view = await apiClient.rpc(getOrgActionView, {
      orgId,
    });
    store.dispatch(viewCreated(view));
    return view;
  };

  const promise = getOrganizerActionView().then((view) => {
    console.log(view, ' djdj');
    env.router.push(
      `/organize/${view.organization.id}/people/lists/${view.id}`
    );
    return view;
  });

  return new PromiseFuture(promise);
  //   return { organizerActionViewFuture };
}
