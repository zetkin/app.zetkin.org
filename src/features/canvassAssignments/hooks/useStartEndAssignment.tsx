import dayjs from 'dayjs';

import useCanvassAssignment from './useCanvassAssignment';
import useCanvassAssignmentMutations from './useCanvassAssignmentMutations';

export default function useStartEndAssignment(
  orgId: number,
  canvassAssId: string
) {
  const canvassAssignment = useCanvassAssignment(orgId, canvassAssId);
  const updateCanvassAssignment = useCanvassAssignmentMutations(
    orgId,
    canvassAssId
  );

  const endAssignment = () => {
    if (!canvassAssignment.data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    updateCanvassAssignment({
      end_date: today,
    });
  };

  const startAssignment = () => {
    if (!canvassAssignment.data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { start_date: startStr, end_date: endStr } = canvassAssignment.data;

    if (!startStr && !endStr) {
      updateCanvassAssignment({
        start_date: today,
      });
    } else if (!startStr) {
      const endDate = dayjs(endStr);
      if (endDate.isBefore(today)) {
        updateCanvassAssignment({
          end_date: null,
          start_date: today,
        });
      } else if (endDate.isAfter(today)) {
        updateCanvassAssignment({
          start_date: today,
        });
      }
    } else if (!endStr) {
      const startDate = dayjs(startStr);
      if (startDate.isAfter(today)) {
        updateCanvassAssignment({
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
        updateCanvassAssignment({
          end_date: null,
        });
      } else if (startDate.isAfter(today) && endDate.isAfter(today)) {
        updateCanvassAssignment({
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
