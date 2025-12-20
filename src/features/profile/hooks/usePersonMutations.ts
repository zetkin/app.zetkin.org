import { personUpdate, personUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { UPDATEDATE } from 'utils/featureFlags';
import useFeature from 'utils/featureFlags/useFeature';
import { ZetkinPerson, ZetkinUpdatePerson } from 'utils/types/zetkin';

type UsePersonMutationsReturn = {
  deletePerson(): Promise<void>;
  updatePerson: (data: ZetkinUpdatePerson) => void;
};

export default function usePersonMutations(
  orgId: number,
  personId: number
): UsePersonMutationsReturn {
  const updatesEnabled = useFeature(UPDATEDATE);

  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deletePerson = async () => {
    await apiClient.delete(
      `/${updatesEnabled ? 'beta' : 'api'}/orgs/${orgId}/people/${personId}`
    );
  };

  const updatePerson = async (data: ZetkinUpdatePerson) => {
    const mutatingAttributes = Object.keys(data);

    dispatch(personUpdate([personId, mutatingAttributes]));

    const updatedPerson = await apiClient.patch<
      ZetkinPerson,
      ZetkinUpdatePerson
    >(
      `/${updatesEnabled ? 'beta' : 'api'}/orgs/${orgId}/people/${personId}`,
      data
    );

    dispatch(personUpdated(updatedPerson));
  };

  return {
    deletePerson,
    updatePerson,
  };
}
