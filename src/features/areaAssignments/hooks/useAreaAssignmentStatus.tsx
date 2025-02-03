import dayjs from 'dayjs';

import useAreaAssignment from './useAreaAssignment';

export enum AreaAssignmentState {
  CLOSED = 'closed',
  DRAFT = 'draft',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default function useAreaAssignmentStatus(
  orgId: number,
  areaAssId: string
): AreaAssignmentState {
  const { data: areaAssignment } = useAreaAssignment(orgId, areaAssId);

  if (!areaAssignment) {
    return AreaAssignmentState.UNKNOWN;
  }

  const now = dayjs();

  if (!areaAssignment.start_date) {
    return AreaAssignmentState.DRAFT;
  }

  const startDate = dayjs(areaAssignment.start_date);

  if (startDate.isAfter(now)) {
    return AreaAssignmentState.SCHEDULED;
  }

  if (areaAssignment.end_date) {
    const endDate = dayjs(areaAssignment.end_date);

    if (endDate.isBefore(now)) {
      return AreaAssignmentState.CLOSED;
    }

    if (startDate.isBefore(now) || startDate.isSame(now)) {
      return AreaAssignmentState.OPEN;
    }
  }

  if (!areaAssignment.end_date && startDate.isBefore(now)) {
    return AreaAssignmentState.OPEN;
  }

  return AreaAssignmentState.UNKNOWN;
}
