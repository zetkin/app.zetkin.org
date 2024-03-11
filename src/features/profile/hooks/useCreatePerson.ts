import { personCreate, personCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCreatePerson, ZetkinPerson } from 'utils/types/zetkin';

export default function useCreatePerson(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createPerson = async (
    body: ZetkinCreatePerson,
    tags: string[]
  ): Promise<ZetkinPerson> => {
    dispatch(personCreate());

    const personFuture = await apiClient
      .post<ZetkinPerson, ZetkinCreatePerson>(`/api/orgs/${orgId}/people`, body)
      .then((data: ZetkinPerson) => {
        dispatch(personCreated());
        console.log(data.id, ' id');
        return data;
      });
    return personFuture;
  };
  return createPerson;
  // return '';
}
