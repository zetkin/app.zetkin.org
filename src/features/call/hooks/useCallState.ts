import { useAppSelector } from 'core/hooks';

export default function useCallState(callId: number) {
  const stateList = useAppSelector((state) => state.call.stateByCallId);
  return stateList[callId]?.data;
}
