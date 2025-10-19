import dayjs from 'dayjs';

import useHouseholdAssignment from './useHouseholdAssignment';

export enum HouseholdAssignmentState {
  CLOSED = 'closed',
  DRAFT = 'draft',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default function useHouseholdAssignmentStatus(
  campId: number,
  orgId: number,
  householdsAssId: number
): HouseholdAssignmentState {
  const { data: householdAssignment } = useHouseholdAssignment(
    campId,
    orgId,
    householdsAssId
  );

  if (!householdAssignment) {
    return HouseholdAssignmentState.UNKNOWN;
  }

  const now = dayjs();

  if (!householdAssignment.start_date) {
    return HouseholdAssignmentState.DRAFT;
  }

  const startDate = dayjs(householdAssignment.start_date);

  if (startDate.isAfter(now)) {
    return HouseholdAssignmentState.SCHEDULED;
  }

  if (householdAssignment.end_date) {
    const endDate = dayjs(householdAssignment.end_date);

    if (endDate.isBefore(now)) {
      return HouseholdAssignmentState.CLOSED;
    }

    if (startDate.isBefore(now) || startDate.isSame(now)) {
      return HouseholdAssignmentState.OPEN;
    }
  }

  if (!householdAssignment.end_date && startDate.isBefore(now)) {
    return HouseholdAssignmentState.OPEN;
  }

  return HouseholdAssignmentState.UNKNOWN;
}
