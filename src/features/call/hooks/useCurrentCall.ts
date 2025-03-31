import { RemoteItem } from 'utils/storeUtils';
import { useAppSelector } from 'core/hooks';
import { ZetkinCall } from '../types';

export default function useCurrentCall(): ZetkinCall | null {
  const state = useAppSelector((state) => state.call);
  const currentCall = state.outgoingCalls.items.find(
    (item: RemoteItem<ZetkinCall>) => item.id == state.currentCallId
  );

  if (currentCall) {
    return currentCall.data;
  } else {
    return null;
  }
}
