import useEmail from './useEmail';

export enum EmailState {
  DRAFT = 'draft',
  SENT = 'sent',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default function useEmailState(orgId: number, emailId: number) {
  const { data: email } = useEmail(orgId, emailId);

  if (!email) {
    return EmailState.UNKNOWN;
  }

  if (email.published) {
    const sendingDate = new Date(email.published);
    const now = new Date();

    if (sendingDate > now) {
      return EmailState.SCHEDULED;
    } else {
      return EmailState.SENT;
    }
  } else {
    return EmailState.DRAFT;
  }
}
