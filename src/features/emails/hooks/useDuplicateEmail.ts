import useCreateEmail from './useCreateEmail';
import useEmail from './useEmail';
import { ZetkinEmailPostBody } from 'utils/types/zetkin';

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

  const duplicateEmail = () => {
    if (email) {
      const duplicateEmailPostBody: ZetkinEmailPostBody = {
        campaign_id: email.campaign.id,
        content: email.content,
        subject: email.subject,
        title: email.title,
      };

      return createEmail(duplicateEmailPostBody);
    }
  };

  return { duplicateEmail };
}
