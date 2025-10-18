import dayjs from 'dayjs';

import useHouseholdAssignment from './useHouseholdAssignment';
import useHouseholdAssignmentMutations from './useHouseholdAssignmentMutations';

export default function useStartEndAssignment(
  orgId: number,
  householdAssId: number
) {
  const householdAssignment = useHouseholdAssignment(orgId, householdAssId);
  const { updateHouseholdAssignment } = useHouseholdAssignmentMutations(
    orgId,
    householdAssId
  );

  const endAssignment = () => {
    if (!householdAssignment.data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    updateHouseholdAssignment({
      end_date: today,
    });
  };

  const startAssignment = () => {
    if (!householdAssignment.data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { start_date: startStr, end_date: endStr } = householdAssignment.data;

    if (!startStr && !endStr) {
      updateHouseholdAssignment({
        start_date: today,
      });
    } else if (!startStr) {
      const endDate = dayjs(endStr);
      if (endDate.isBefore(today)) {
        updateHouseholdAssignment({
          end_date: null,
          start_date: today,
        });
      } else if (endDate.isAfter(today)) {
        updateHouseholdAssignment({
          start_date: today,
        });
      }
    } else if (!endStr) {
      const startDate = dayjs(startStr);
      if (startDate.isAfter(today)) {
        updateHouseholdAssignment({
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
        updateHouseholdAssignment({
          end_date: null,
        });
      } else if (startDate.isAfter(today) && endDate.isAfter(today)) {
        updateHouseholdAssignment({
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
