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
  const { data: assignmentData } = useCallAssignment(orgId, assignmentId);
  const { data: statsData } = useCallAssignmentStats(orgId, assignmentId);

  if (!assignmentData) {
    return CallAssignmentState.UNKNOWN;
  }

  if (assignmentData.start_date) {
    const startDate = new Date(assignmentData.start_date);
    const now = new Date();
    if (startDate > now) {
      return CallAssignmentState.SCHEDULED;
    } else {
      if (assignmentData.end_date) {
        const endDate = new Date(assignmentData.end_date);
        if (endDate < now) {
          return CallAssignmentState.CLOSED;
        }
      }

      if (!statsData?.mostRecentCallTime) {
        return CallAssignmentState.OPEN;
      }

      const mostRecentCallTime = new Date(statsData.mostRecentCallTime);
      const diff = now.getTime() - mostRecentCallTime.getTime();

      return diff < 10 * 60 * 1000
        ? CallAssignmentState.ACTIVE
        : CallAssignmentState.OPEN;
    }
  } else {
    return CallAssignmentState.DRAFT;
  }
}
