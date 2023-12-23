import copyEmail from '../rpc/copyEmail';
import { emailCreate, emailCreated, emailUpdate, emailUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type useDuplicateEmailReturn = {
  duplicateEmail: () => void;
};

export default function useDuplicateEmail(
  orgId: number,
  emailId: number
): useDuplicateEmailReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const duplicateEmail = async () => {
    dispatch(emailCreate);
    const duplicatedEmail = await apiClient.rpc(copyEmail, {
      emailId: emailId,
      orgId: orgId,
    });
    dispatch(emailUpdate([duplicatedEmail.id, ['target']]));
    dispatch(emailCreated([duplicatedEmail, duplicatedEmail.campaign.id]));
    dispatch(
      emailUpdated([
        {
          ...duplicatedEmail,
          target: duplicatedEmail.target,
        },
        ['target'],
      ])
    );
  };

  return { duplicateEmail };
}
