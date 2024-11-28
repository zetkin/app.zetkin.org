import dayjs from 'dayjs';

import useCanvassAssignment from './useCanvassAssignment';

export enum CanvassAssignmentState {
  CLOSED = 'closed',
  DRAFT = 'draft',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default function useCanvassAssignmentStatus(
  orgId: number,
  canvassId: string
): CanvassAssignmentState {
  const { data: canvassAssignment } = useCanvassAssignment(orgId, canvassId);

  if (!canvassAssignment) {
    return CanvassAssignmentState.UNKNOWN;
  }

  const now = dayjs();

  if (!canvassAssignment.start_date) {
    return CanvassAssignmentState.DRAFT;
  }

  const startDate = dayjs(canvassAssignment.start_date);

  if (startDate.isAfter(now)) {
    return CanvassAssignmentState.SCHEDULED;
  }

  if (canvassAssignment.end_date) {
    const endDate = dayjs(canvassAssignment.end_date);

    if (endDate.isBefore(now)) {
      return CanvassAssignmentState.CLOSED;
    }

    if (startDate.isBefore(now) || startDate.isSame(now)) {
      return CanvassAssignmentState.OPEN;
    }
  }

  if (!canvassAssignment.end_date && startDate.isBefore(now)) {
    return CanvassAssignmentState.OPEN;
  }

  return CanvassAssignmentState.UNKNOWN;
}
