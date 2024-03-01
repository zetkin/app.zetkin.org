import { Box } from '@mui/material';
import { useContext } from 'react';
import { ContentCopy, Delete } from '@mui/icons-material';

import CancelButton from './CancelButton';
import DeliveryButton from './DeliveryButton';
import messageIds from '../l10n/messageIds';
import useDuplicateEmail from '../hooks/useDuplicateEmail';
import useEmail from '../hooks/useEmail';
import { useMessages } from 'core/i18n';
import { ZetkinEmail } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

interface EmailActionButtonsProp {
  email: ZetkinEmail;
  orgId: number;
}

const EmailActionButtons = ({ email, orgId }: EmailActionButtonsProp) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { deleteEmail, updateEmail } = useEmail(orgId, email.id);
  const { duplicateEmail } = useDuplicateEmail(orgId, email.id);

  return (
    <Box display="flex">
      {email.published ? (
        <CancelButton onClick={() => updateEmail({ published: null })} />
      ) : (
        <DeliveryButton email={email} />
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
