'use client';
import { FC } from 'react';
import Box from '@mui/system/Box';

import { Msg, useMessages } from 'core/i18n';
import ZUIModal from 'zui/components/ZUIModal';
import ZUIText from 'zui/components/ZUIText';
import messageIds from '../l10n/messageIds';
type SignupChoiceModalProps = {
  eventId: number;
  onClose: () => void;
  orgId: number;
};

const SignupChoiceModal: FC<SignupChoiceModalProps> = ({
  eventId,
  onClose,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const eventUrl = `/o/${orgId}/events/${eventId}`;
  const loginUrl = `/login?redirect=${encodeURIComponent(eventUrl)}`;

  return (
    <ZUIModal
      onClose={onClose}
      open={true}
      primaryButton={{
        href: loginUrl,
        label: messages.signupChoiceModal.withAccount(),
      }}
      secondaryButton={{
        href: eventUrl,
        label: messages.signupChoiceModal.withoutAccount(),
      }}
      size="small"
      title={messages.signupChoiceModal.title()}
    >
      <Box sx={{ paddingTop: '0.75rem' }}>
        <ZUIText>
          <Msg id={messageIds.signupChoiceModal.description} />
        </ZUIText>
      </Box>
    </ZUIModal>
  );
};
export default SignupChoiceModal;
