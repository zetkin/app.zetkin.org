import useCanvassAssignment from './useCanvassAssignment';

export enum CanvassAssignmentState {
  CLOSED = 'closed',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unkown',
}

export default function useCanvassAssignmentStatus(
  orgId: number,
  canvassId: string
): CanvassAssignmentState {
  const { data: canvassAssignment } = useCanvassAssignment(orgId, canvassId);

  if (!canvassAssignment) {
    return CanvassAssignmentState.UNKNOWN;
  }

  if (canvassAssignment.start_date) {
    const startDate = new Date(canvassAssignment.start_date);
    const now = new Date();

    if (startDate > now) {
      return CanvassAssignmentState.SCHEDULED;
    }

    if (canvassAssignment.end_date) {
      const endDate = new Date(canvassAssignment.end_date);

      if (endDate < now) {
        return CanvassAssignmentState.CLOSED;
      }

      if (startDate <= now && endDate > now) {
        return CanvassAssignmentState.OPEN;
      }
    }
  }
  return CanvassAssignmentState.UNKNOWN;
}
