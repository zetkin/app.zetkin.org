import dayjs from 'dayjs';

import useVisitAssignment from './useVisitAssignment';

export enum VisitAssignmentState {
  CLOSED = 'closed',
  DRAFT = 'draft',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default function useVisitAssignmentStatus(
  campId: number,
  orgId: number,
  visitAssId: number
): VisitAssignmentState {
  const { data: visitAssignment } = useVisitAssignment(
    campId,
    orgId,
    visitAssId
  );

  if (!visitAssignment) {
    return VisitAssignmentState.UNKNOWN;
  }

  const now = dayjs();

  if (!visitAssignment.start_date) {
    return VisitAssignmentState.DRAFT;
  }

  const startDate = dayjs(visitAssignment.start_date);

  if (startDate.isAfter(now)) {
    return VisitAssignmentState.SCHEDULED;
  }

  if (visitAssignment.end_date) {
    const endDate = dayjs(visitAssignment.end_date);

    if (endDate.isBefore(now)) {
      return VisitAssignmentState.CLOSED;
    }

    if (startDate.isBefore(now) || startDate.isSame(now)) {
      return VisitAssignmentState.OPEN;
    }
  }

  if (!visitAssignment.end_date && startDate.isBefore(now)) {
    return VisitAssignmentState.OPEN;
  }

  return VisitAssignmentState.UNKNOWN;
}
