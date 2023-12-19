import copyEmail from '../rpc/copyEmail';
import { useApiClient } from 'core/hooks';
import useCreateEmail from './useCreateEmail';
import useEmail from './useEmail';

type useDuplicateEmailReturn = {
  duplicateEmail: () => void;
};

export default function useDuplicateEmail(
  orgId: number,
  campId: number,
  emailId: number
): useDuplicateEmailReturn {
  const { data: email } = useEmail(orgId, emailId);
  const { createEmail } = useCreateEmail(orgId, campId);
  const apiClient = useApiClient();

  const duplicateEmail = async () => {
    console.log('hello');
    await apiClient.rpc(copyEmail, {
      emailId: emailId,
      orgId: orgId,
    });
    // dispatch(eventsCreated(duplicatedEvents));
    // if (email) {
    //   const duplicateEmailPostBody: ZetkinEmailPostBody = {
    //     campaign_id: email.campaign.id,
    //     content: email.content,
    //     subject: email.subject,
    //     title: email.title,
    //   };

    //   return createEmail(duplicateEmailPostBody);
    // }
  };

  return { duplicateEmail };
}
