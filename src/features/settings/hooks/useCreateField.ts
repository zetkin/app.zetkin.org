import useApiClient from 'core/hooks/useApiClient';

type UseCreateFieldsReturn = {
  createField: () => void;
};

export default function useCreateField(orgId: number): UseCreateFieldsReturn {
  const apiClient = useApiClient();

  const createField = async () => {
    await apiClient.post(`/api/orgs/${orgId}/people/fields/`, {
      slug: 'farahs_test_12',
      title: 'Farahs Field',
      type: 'text',
    });
  };

  return { createField };
}
