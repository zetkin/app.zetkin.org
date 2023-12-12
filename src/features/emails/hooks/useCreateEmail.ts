import { useAppDispatch } from 'core/hooks';
import { ZetkinEmail } from 'utils/types/zetkin';
import { emailCreate, emailCreated } from '../store';

interface UseCreateEmailReturn {
  createEmail: (body: Partial<ZetkinEmail>) => ZetkinEmail;
  //   createEmail: (body: ZetkinEmailPartial) => IFuture<ZetkinEmail>;
}

export default function useCreateEmail(
  orgId: number,
  campId: number
): UseCreateEmailReturn {
  //   const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createEmail = (body: Partial<ZetkinEmail>) => {
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
    const email: ZetkinEmail = {
      campaign_id: 121,
      content: 'world',
      id: 1,
      organization: { id: 6, title: 'Casework test' },
      published: '',
      subject: 'any',
      target_query: {
        filter_spec: [],
        organization_id: 6,
        query_type: 'email_target',
        title: '',
      },
      title: body.title!,
    };

    dispatch(emailCreated([email, campId]));
    return email;
    // return new PromiseFuture(email);
  };

  return { createEmail };
}
