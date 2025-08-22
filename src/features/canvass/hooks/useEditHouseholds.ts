import { useApiClient, useAppDispatch } from 'core/hooks';
import editHouseholds from '../rpc/editHouseholds';
import { householdUpdated } from '../store';

export default function useEditHouseholds(orgId: number, locationId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (
    householdIds: number[],
    updates: { colorCode?: string | null; level?: number }
  ) => {
    const { updatedHouseholds } = await apiClient.rpc(editHouseholds, {
      colorCode: updates.colorCode,
      householdIds,
      level: updates.level,
      locationId,
      orgId,
    });

    updatedHouseholds.forEach((household) =>
      dispatch(householdUpdated([locationId, household]))
    );
  };
}
