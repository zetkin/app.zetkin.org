import { useAppSelector } from 'core/hooks';
import useMyAssignments from './useMyAssignments';

export default function useCurrentAssignment() {
  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const myAssignments = useMyAssignments();
  const assignment = myAssignments.find((a) => a.id == lane.assignmentId);
  return assignment ?? null;
}
