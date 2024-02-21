import { ArrowDropDown, ContentCopy, Delete } from '@mui/icons-material';
import { Box, Button, Popper } from '@mui/material';
import { useContext, useState } from 'react';

import EmailDelivery from './EmailDelivery';
import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import useDuplicateEmail from '../hooks/useDuplicateEmail';
import useEmail from '../hooks/useEmail';
import useEmailStats from '../hooks/useEmailStats';
import { useMessages } from 'core/i18n';
import { ZetkinEmail } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

interface EmailActionButtonsProp {
  email: ZetkinEmail;
  emailState: EmailState;
  orgId: number;
}

const EmailActionButtons = ({
  email,
  emailState,
  orgId,
}: EmailActionButtonsProp) => {
  const messages = useMessages(messageIds);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { deleteEmail } = useEmail(orgId, email.id);
  const { duplicateEmail } = useDuplicateEmail(orgId, email.id);
  const { data: emailStats } = useEmailStats(orgId, email.id);

  const deliveryDisabled =
    emailStats?.num_target_matches === 0 ||
    emailState === EmailState.SENT ||
    !email.locked;

  return (
    <Box display="flex">
      <Button
        disabled={deliveryDisabled}
        endIcon={<ArrowDropDown />}
        onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)}
        variant="contained"
      >
        {messages.emailActionButtons.delivery()}
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
