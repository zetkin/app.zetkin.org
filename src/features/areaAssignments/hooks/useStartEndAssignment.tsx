import dayjs from 'dayjs';

import useAreaAssignment from './useAreaAssignment';
import useAreaAssignmentMutations from './useAreaAssignmentMutations';

export default function useStartEndAssignment(
  orgId: number,
  areaAssId: string
) {
  const areaAssignment = useAreaAssignment(orgId, areaAssId);
  const { updateAreaAssignment } = useAreaAssignmentMutations(orgId, areaAssId);

  const endAssignment = () => {
    if (!areaAssignment.data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    updateAreaAssignment({
      end_date: today,
    });
  };

  const startAssignment = () => {
    if (!areaAssignment.data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { start_date: startStr, end_date: endStr } = areaAssignment.data;

    if (!startStr && !endStr) {
      updateAreaAssignment({
        start_date: today,
      });
    } else if (!startStr) {
      const endDate = dayjs(endStr);
      if (endDate.isBefore(today)) {
        updateAreaAssignment({
          end_date: null,
          start_date: today,
        });
      } else if (endDate.isAfter(today)) {
        updateAreaAssignment({
          start_date: today,
        });
      }
    } else if (!endStr) {
      const startDate = dayjs(startStr);
      if (startDate.isAfter(today)) {
        updateAreaAssignment({
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
        updateAreaAssignment({
          end_date: null,
        });
      } else if (startDate.isAfter(today) && endDate.isAfter(today)) {
        updateAreaAssignment({
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
