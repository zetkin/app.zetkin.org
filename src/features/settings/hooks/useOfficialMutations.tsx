import setOfficialRole from '../rpc/setOfficialRole';
import { accessDeleted, roleUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type useRolesMutationsReturn = {
  removeAccess: (personId: number) => void;
  updateRole: (personId: number, role: 'organizer' | 'admin') => void;
};

export default function useOfficialMutations(
  orgId: number
): useRolesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const removeAccess = async (personId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/officials/${personId}`);
    dispatch(accessDeleted(personId));
  };

  const updateRole = async (personId: number, role: 'organizer' | 'admin') => {
    await apiClient
      .rpc(setOfficialRole, {
        orgId,
        personId,
        role,
      })
      .then((membership) => {
        if (membership) {
          dispatch(roleUpdated([personId, membership]));
        }
      });
  };

  return {
    removeAccess,
    updateRole,
  };
}
