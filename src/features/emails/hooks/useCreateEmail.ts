import { useAppDispatch } from 'core/hooks';
import { emailCreate, emailCreated } from '../store';
import { ZetkinEmail, ZetkinEmailPartial } from 'utils/types/zetkin';

interface UseCreateEmailReturn {
  createEmail: (body: ZetkinEmailPartial) => ZetkinEmail;
  //   createEmail: (body: ZetkinEmailPartial) => IFuture<ZetkinEmail>;
}

export default function useCreateEmail(
  orgId: number,
  campId: number
): UseCreateEmailReturn {
  //   const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createEmail = (body: ZetkinEmailPartial) => {
    dispatch(emailCreate);
    // const promise = apiClient
    //   .post<ZetkinEmail, ZetkinEmailPartial>(
    //     `/api/orgs/${orgId}/campaigns/${campId}/emails`,
    //     body
    //   )
    //   .then((email) => {
    //     dispatch(emailCreated);
    //     return email;
    //   });

    //fake email
    const email = {
      content: 'world',
      id: 1,
      organization: { id: 6, title: 'Casework test' },
      published: '2023-12-11T12:53:42',
      subject: 'any',
      title: body.title!,
    };

    dispatch(emailCreated([email, campId]));
    return email;
    // return new PromiseFuture(email);
  };

  return { createEmail };
}
