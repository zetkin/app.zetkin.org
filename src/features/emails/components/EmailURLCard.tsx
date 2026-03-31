import React, { useMemo } from 'react';

import useMessages from 'core/i18n/useMessages';
import messageIds from '../l10n/messageIds';
import ZUIURLCard from 'zui/components/ZUIURLCard';
import useEmail from '../hooks/useEmail';

interface EmailURLCardProps {
  isOpen: boolean;
  orgId: number;
  emailId: number;
}

const EmailURLCard = ({ isOpen, orgId, emailId }: EmailURLCardProps) => {
  const email = useEmail(orgId, emailId);
  const messages = useMessages(messageIds);

  const relativeUrl = useMemo(
    () =>
      email.data
        ? `/o/${email.data.organization.id}/viewmail/${email.data.uuid}`
        : '',
    [email.data]
  );

  return (
    <ZUIURLCard
      absoluteUrl={`${location.protocol}//${location.host}${relativeUrl}`}
      isOpen={isOpen}
      messages={messages.urlCard}
      relativeUrl={relativeUrl}
    />
  );
};

export default EmailURLCard;
