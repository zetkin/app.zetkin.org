import { personCreate, personCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinPerson, ZetkinPersonPostBody } from 'utils/types/zetkin';

export default function useCreatePerson(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  //   const createPerson = async (
  //     body: ZetkinPersonPostBody
  //   ): Promise<ZetkinPerson> => {
  //     dispatch(personCreate());
  //     console.log(body, ' body');
  //     const taskFuture = await apiClient
  //       .post<ZetkinPerson, ZetkinPersonPostBody>(
  //         `/api/orgs/${orgId}/people`,
  //         body
  //       )
  //       .then((data: ZetkinPerson) => {
  //         dispatch(personCreated());
  //         console.log(data, ' ???');
  //         return data;
  //       });
  //     return taskFuture;
  //   };
  //   return createPerson;
  return '';
}
