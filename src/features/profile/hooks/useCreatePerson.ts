import { personLoaded } from '../store';
import useTagging from 'features/tags/hooks/useTagging';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCreatePerson, ZetkinPerson } from 'utils/types/zetkin';

export default function useCreatePerson(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { assignToPerson } = useTagging(orgId);

  const createPerson = async (
    body: ZetkinCreatePerson,
    tags: number[]
  ): Promise<ZetkinPerson> => {
    const person = await apiClient.post<ZetkinPerson, ZetkinCreatePerson>(
      `/api/orgs/${orgId}/people`,
      body
    );
    dispatch(personLoaded([person.id, person]));
    tags.map((tagId) => {
      assignToPerson(person.id, tagId);
    });
    return person;
  };
  return createPerson;
}
