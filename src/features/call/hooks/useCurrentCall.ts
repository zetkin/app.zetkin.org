import { RemoteItem } from 'utils/storeUtils';
import { useAppSelector } from 'core/hooks';
import { ZetkinCall } from '../types';

export default function useCurrentCall(): ZetkinCall | null {
  const state = useAppSelector((state) => state.call);
  const activeLane = state.lanes[state.activeLaneIndex];
  const currentCallId = activeLane.currentCallId;

  const currentCall =
    state.outgoingCalls.items.find(
      (item: RemoteItem<ZetkinCall>) => item.id === currentCallId
    ) ||
    state.unfinishedCalls.items.find(
      (item: RemoteItem<ZetkinCall>) => item.id === currentCallId
    );

  return currentCall?.data ?? null;
}
