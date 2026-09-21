import { useMemo } from 'react';

import { useAppSelector } from 'core/hooks';
import { UnfinishedCall } from '../types';

export default function useCurrentCall(): UnfinishedCall | null {
  const state = useAppSelector((state) => state.call);
  const activeLane = state.lanes[state.activeLaneIndex];
  const currentCallId = activeLane.currentCallId;

  const currentCall = useMemo(
    () => state.unfinishedCalls.items.find((item) => item.id == currentCallId),
    [currentCallId, state.unfinishedCalls]
  );

  return currentCall?.data ?? null;
}
