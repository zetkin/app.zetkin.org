import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { ContentCopy, Delete, Send } from '@mui/icons-material';

import CancelButton from './CancelButton';
import DeliveryButton from './DeliveryButton';
import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import useDuplicateEmail from '../hooks/useDuplicateEmail';
import useEmail from '../hooks/useEmail';
import { ZetkinEmail } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { Msg, useMessages } from 'core/i18n';

interface EmailActionButtonsProp {
  email: ZetkinEmail;
  orgId: number;
  state: EmailState;
}

const EmailActionButtons = ({
  email,
  orgId,
  state,
}: EmailActionButtonsProp) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { deleteEmail, updateEmail } = useEmail(orgId, email.id);
  const { duplicateEmail } = useDuplicateEmail(orgId, email.id);

  return (
    <Box display="flex">
      {state === EmailState.SCHEDULED && (
        <CancelButton onClick={() => updateEmail({ published: null })} />
      )}
      {state === EmailState.DRAFT && <DeliveryButton email={email} />}
      {email.published &&
        state === EmailState.SENT &&
        email.processed !== null && (
          <Box alignItems="center" display="flex">
            <Send color="secondary" sx={{ mr: 1 }} />
            <Typography color="secondary">
              <Msg
                id={messageIds.deliveryStatus.wasSent}
                values={{
                  datetime: (
                    <ZUIDateTime convertToLocal datetime={email.published} />
                  ),
                }}
              />
            </Typography>
          </Box>
        )}
      {email.published &&
        state === EmailState.SENT &&
        email.processed === null && (
          <Box alignItems="center" display="flex">
            <Send color="secondary" sx={{ mr: 1 }} />
            <Typography color="secondary">
              <Msg id={messageIds.deliveryStatus.notProcessed} />
            </Typography>
          </Box>
        )}
      <ZUIEllipsisMenu
        items={[
          {
            label: <>{messages.emailActionButtons.duplicate()}</>,
            onSelect: () => duplicateEmail(),
            startIcon: <ContentCopy />,
          },
          {
            label: <>{messages.emailActionButtons.delete()}</>,
            onSelect: () => {
              showConfirmDialog({
                onSubmit: deleteEmail,
                title: messages.emailActionButtons.delete(),
                warningText: messages.emailActionButtons.warning(),
              });
            },
            startIcon: <Delete />,
          },
        ]}
      />
    </Box>
  );
};

export default EmailActionButtons;
