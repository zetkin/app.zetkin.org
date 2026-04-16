import { useAppDispatch } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import { fieldRemoved } from 'features/profile/store';

type UseFieldsMutationReturn = {
  removeField: (fieldId: number) => void;
};

export default function useFieldMutations(
  orgId: number
): UseFieldsMutationReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const removeField = async (fieldId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/people/fields/${fieldId}`);
    dispatch(fieldRemoved(fieldId));
  };

  return { removeField };
}
