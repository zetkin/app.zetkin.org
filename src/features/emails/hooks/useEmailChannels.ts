import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinEmailChannel } from '../types';
import { channelsLoad, channelsLoaded } from '../store';

export default function useEmailChannels(
  orgId: number
): IFuture<ZetkinEmailChannel[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const channelList = useAppSelector((state) => state.emails.channelList);

  return loadListIfNecessary(channelList, dispatch, {
    actionOnLoad: () => channelsLoad(),
    actionOnSuccess: (items) => channelsLoaded(items),
    loader: () =>
      apiClient.get<ZetkinEmailChannel[]>(`/api2/orgs/${orgId}/channels`),
  });
}
