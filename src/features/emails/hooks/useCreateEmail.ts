import { emailCreate, emailCreated } from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEmail, ZetkinEmailPartial } from 'utils/types/zetkin';

interface UseCreateEmailReturn {
  createEmail: (body: ZetkinEmailPartial) => ZetkinEmail;
  //   createEmail: (body: ZetkinEmailPartial) => IFuture<ZetkinEmail>;
}

export default function useCreateEmail(
  orgId: number,
  campId: number
): UseCreateEmailReturn {
  const apiClient = useApiClient();
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
      published: '2022-03-03',
      subject: 'any',
      title: body.title!,
    };

    dispatch(emailCreated([email, campId]));
    return email;
    // return new PromiseFuture(email);
  };

  return { createEmail };
}
