import { useApiClient } from 'core/hooks';

type UsePersonMutationsReturn = {
  deletePerson(): Promise<void>;
};

export default function usePersonMutations(
  orgId: number,
  personId: number
): UsePersonMutationsReturn {
  const apiClient = useApiClient();

  const deletePerson = async () => {
    await apiClient.delete(`/api/orgs/${orgId}/people/${personId}`);
  };

  return {
    deletePerson,
  };
}
