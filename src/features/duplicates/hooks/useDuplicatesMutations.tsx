import { ZetkinPerson } from 'utils/types/zetkin';
import {
  addedPotentialDuplicatePerson,
  dismissedPotentialDuplicate,
  PotentialDuplicate,
  removedPotentialDuplicatePerson,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type DuplicatesMutationsReturn = {
  addDuplicatePerson: (duplicateId: number, person: ZetkinPerson) => void;
  dismissDuplicate: (duplicateId: number) => void;
  removeDuplicatePerson: (duplicateId: number, person: ZetkinPerson) => void;
};

export default function useDuplicatesMutations(
  orgId: number
): DuplicatesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const addDuplicatePerson = async (
    duplicateId: number,
    person: ZetkinPerson
  ) => {
    dispatch(addedPotentialDuplicatePerson([duplicateId, person]));
  };

  const dismissDuplicate = async (duplicateId: number) => {
    const dismissedDate = new Date().toISOString();
    await apiClient
      .patch<PotentialDuplicate>(
        `/orgs/${orgId}/people/duplicates/${duplicateId}`,
        { dismissed: dismissedDate }
      )
      .then((duplicate) => {
        dispatch(dismissedPotentialDuplicate(duplicate));
      });
  };

  const removeDuplicatePerson = async (
    duplicateId: number,
    person: ZetkinPerson
  ) => {
    dispatch(removedPotentialDuplicatePerson([duplicateId, person]));
  };

  return {
    addDuplicatePerson,
    dismissDuplicate,
    removeDuplicatePerson,
  };
}
