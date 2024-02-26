import { ArrowDropDown, ContentCopy, Delete } from '@mui/icons-material';
import { Box, Button, Popper } from '@mui/material';
import { useContext, useState } from 'react';

import EmailDelivery from './EmailDelivery';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { deleteEmail, updateEmail } = useEmail(orgId, email.id);
  const { duplicateEmail } = useDuplicateEmail(orgId, email.id);

  return (
    <Box display="flex">
      <Button
        endIcon={email.published ? '' : <ArrowDropDown />}
        onClick={(event) => {
          if (email.published) {
            updateEmail({ published: null });
          } else {
            setAnchorEl(anchorEl ? null : event.currentTarget);
          }
        }}
        variant={email.published ? 'outlined' : 'contained'}
      >
        {email.published
          ? messages.emailActionButtons.cancel()
          : messages.emailActionButtons.delivery()}
      </Button>
      <Popper anchorEl={anchorEl} open={!!anchorEl} placement="bottom-end">
        <EmailDelivery
          email={email}
          onClose={() => setAnchorEl(null)}
          orgId={orgId}
        />
      </Popper>
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
