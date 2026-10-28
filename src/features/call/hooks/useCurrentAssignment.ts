import { useMemo } from 'react';

import { useAppSelector } from 'core/hooks';
import useMyAssignments from 'features/call/hooks/useMyAssignments';

export default function useCurrentAssignment() {
  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const userAssignments = useMyAssignments();

  const assignment = useMemo(
    () =>
      userAssignments.find((assignment) => assignment.id == lane.assignmentId),
    [lane.assignmentId, userAssignments]
  );

  if (!assignment) {
    throw Error('User does not have assignment in their list.');
  }

  return assignment;
}
