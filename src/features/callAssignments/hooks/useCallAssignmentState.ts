import useCallAssignment from './useCallAssignment';
import useCallAssignmentStats from './useCallAssignmentStats';

export enum CallAssignmentState {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default function useCallAssignmentState(
  orgId: number,
  assignmentId: number
): CallAssignmentState {
  const { data: callAssignment } = useCallAssignment(orgId, assignmentId);
  const { statsFuture } = useCallAssignmentStats(orgId, assignmentId);

  if (!callAssignment) {
    return CallAssignmentState.UNKNOWN;
  }

  if (callAssignment.start_date) {
    const startDate = new Date(callAssignment.start_date);
    const now = new Date();
    if (startDate > now) {
      return CallAssignmentState.SCHEDULED;
    } else {
      if (callAssignment.end_date) {
        const endDate = new Date(callAssignment.end_date);
        if (endDate < now) {
          return CallAssignmentState.CLOSED;
        }
      }

      if (!statsFuture.data?.mostRecentCallTime) {
        return CallAssignmentState.OPEN;
      }

      const mostRecentCallTime = new Date(statsFuture.data.mostRecentCallTime);
      const diff = now.getTime() - mostRecentCallTime.getTime();

      return diff < 10 * 60 * 1000
        ? CallAssignmentState.ACTIVE
        : CallAssignmentState.OPEN;
    }
  } else {
    return CallAssignmentState.DRAFT;
  }
}
