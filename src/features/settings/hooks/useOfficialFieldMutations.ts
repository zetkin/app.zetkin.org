import { useAppDispatch } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import { fieldRemoved } from 'features/profile/store';

type UseFieldsMutationReturn = {
  createField: () => void;
  removeField: (fieldId: number) => void;
};

export default function useOfficialFieldMutations(
  orgId: number
): UseFieldsMutationReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createField = async () => {
    await apiClient.post(`/api/orgs/${orgId}/people/fields/`, {
      slug: 'farahs_test_10',
      title: 'Farahs Field',
      type: 'text',
    });
  };

  const removeField = async (fieldId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/people/fields/${fieldId}`);
    dispatch(fieldRemoved(fieldId));
  };

  return { createField, removeField };
}
