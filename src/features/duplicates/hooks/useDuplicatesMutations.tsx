import { dismissedDuplicate, ZetkinDuplicate } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type DuplicatesMutationsReturn = {
  dismissDuplicate: (duplicateId: number) => void;
};

export default function useDuplicatesMutations(
  orgId: number
): DuplicatesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  type ZetkinDuplicatePatchBody = Partial<
    Omit<ZetkinDuplicate, 'id' | 'dismissed'>
  > & {
    dismissed?: boolean;
  };

  const dismissDuplicate = async (duplicateId: number) => {
    await apiClient
      .patch<ZetkinDuplicate, ZetkinDuplicatePatchBody>(
        `/api/orgs/${orgId}/people/duplicates/${duplicateId}`,
        { dismissed: true }
      )
      .then((duplicate) => {
        dispatch(dismissedDuplicate(duplicate));
      });
  };

  return {
    dismissDuplicate,
  };
}
