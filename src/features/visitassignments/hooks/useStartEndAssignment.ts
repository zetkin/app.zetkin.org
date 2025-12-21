import dayjs from 'dayjs';

import useVisitAssignment from './useVisitAssignment';
import useVisitAssignmentMutations from './useVisitAssignmentMutations';

export default function useStartEndAssignment(
  orgId: number,
  visitAssId: number
) {
  const visitAssignment = useVisitAssignment(orgId, visitAssId);
  const { updateVisitAssignment } = useVisitAssignmentMutations(
    orgId,
    visitAssId
  );

  const endAssignment = () => {
    if (!visitAssignment.data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    updateVisitAssignment({
      end_date: today,
    });
  };

  const startAssignment = () => {
    if (!visitAssignment.data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { start_date: startStr, end_date: endStr } = visitAssignment.data;

    if (!startStr && !endStr) {
      updateVisitAssignment({
        start_date: today,
      });
    } else if (!startStr) {
      const endDate = dayjs(endStr);
      if (endDate.isBefore(today)) {
        updateVisitAssignment({
          end_date: null,
          start_date: today,
        });
      } else if (endDate.isAfter(today)) {
        updateVisitAssignment({
          start_date: today,
        });
      }
    } else if (!endStr) {
      const startDate = dayjs(startStr);
      if (startDate.isAfter(today)) {
        updateVisitAssignment({
          start_date: today,
        });
      }
    } else {
      const startDate = dayjs(startStr);
      const endDate = dayjs(endStr);

      if (
        (startDate.isBefore(today) || startDate.isSame(today)) &&
        (endDate.isBefore(today) || endDate.isSame(today))
      ) {
        updateVisitAssignment({
          end_date: null,
        });
      } else if (startDate.isAfter(today) && endDate.isAfter(today)) {
        updateVisitAssignment({
          start_date: today,
        });
      }
    }
  };

  return {
    endAssignment,
    startAssignment,
  };
}
