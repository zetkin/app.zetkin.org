import { ZetkinOfficial } from 'utils/types/zetkin';
import { accessDeleted, adminAdded, organizerAdded } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type useRolesMutationsReturn = {
  addToAdmin: (personId: number) => void;
  addToOrganizer: (personId: number) => void;
  removeAccess: (personId: number) => void;
};

export default function useRolesMutations(
  orgId: number
): useRolesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const addToOrganizer = async (personId: number) => {
    return apiClient
      .put<ZetkinOfficial>(`/api/orgs/${orgId}/officials/${personId}`, {
        role: 'organizer',
      })
      .then((user) => {
        dispatch(adminAdded([personId, user]));
        return user;
      });
  };

  const addToAdmin = async (personId: number) => {
    return apiClient
      .put<ZetkinOfficial>(`/api/orgs/${orgId}/officials/${personId}`, {
        role: 'admin',
      })
      .then((user) => {
        dispatch(organizerAdded([personId, user]));
        return user;
      });
  };

  const removeAccess = async (personId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/officials/${personId}`);
    dispatch(accessDeleted(personId));
  };

  return {
    addToAdmin,
    addToOrganizer,
    removeAccess,
  };
}
