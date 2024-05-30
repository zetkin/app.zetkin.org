import { duplicateUpdated, PotentialDuplicate } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type DuplicatesMutationsReturn = {
  dismissDuplicate: (duplicateId: number) => void;
};

export default function useDuplicatesMutations(
  orgId: number
): DuplicatesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const dismissDuplicate = async (duplicateId: number) => {
    const dismissedDate = new Date().toISOString();
    await apiClient
      .patch<PotentialDuplicate>(
        `/orgs/${orgId}/people/duplicates/${duplicateId}`,
        { dismissed: dismissedDate }
      )
      .then((duplicate) => {
        dispatch(duplicateUpdated(duplicate));
      });
  };

  return {
    dismissDuplicate,
  };
}
