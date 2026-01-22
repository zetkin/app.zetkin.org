import { useAppSelector } from 'core/hooks';
import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';

export default function useCurrentAssignment() {
  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const userAssignments = useMyCallAssignments();

  const assignment = userAssignments.find(
    (assignment) => assignment.id === lane.assignmentId
  );

  if (!assignment) {
    throw Error('User does not have assignment in their list.');
  }

  return assignment;
}
