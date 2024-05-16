import { ZetkinOfficial } from 'utils/types/zetkin';
import { accessDeleted, adminDemoted, organizerPromoted } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type useRolesMutationsReturn = {
  demoteAdmin: (personId: number) => void;
  promoteOrganizer: (personId: number) => void;
  removeAccess: (personId: number) => void;
};

export default function useRolesMutations(
  orgId: number
): useRolesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const demoteAdmin = async (personId: number) => {
    return apiClient
      .put<ZetkinOfficial>(`/api/orgs/${orgId}/officials/${personId}`, {
        role: 'organizer',
      })
      .then((user) => {
        dispatch(adminDemoted([personId, user]));
        return user;
      });
  };

  const promoteOrganizer = async (personId: number) => {
    return apiClient
      .put<ZetkinOfficial>(`/api/orgs/${orgId}/officials/${personId}`, {
        role: 'admin',
      })
      .then((user) => {
        dispatch(organizerPromoted([personId, user]));
        return user;
      });
  };

  const removeAccess = async (personId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/officials/${personId}`);
    dispatch(accessDeleted(personId));
  };

  return { demoteAdmin, promoteOrganizer, removeAccess };
}
