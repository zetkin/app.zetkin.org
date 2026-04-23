import { useAppSelector } from 'core/hooks';
import { UnfinishedCall } from '../types';

export default function useCurrentCall(orgId: number): UnfinishedCall | null {
  const state = useAppSelector((state) => state.call);
  const activeLane = state.lanes[state.activeLaneIndex];
  const currentCallId = activeLane.currentCallId;

  const currentCall = state.unfinishedCallsByOrgId[orgId]?.items.find(
    (item) => item.id == currentCallId
  );

  return currentCall?.data ?? null;
}
