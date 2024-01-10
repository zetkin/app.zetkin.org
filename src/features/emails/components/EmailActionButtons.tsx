import { ArrowDropDown, ContentCopy, Delete } from '@mui/icons-material';
import { Box, Button, Popper } from '@mui/material';
import { useContext, useState } from 'react';

import DeliveryStatusSpan from './DeliveryStatusSpan';
import EmailDeliveryPanel from './EmailDeliveryPanel';
import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import useDuplicateEmail from '../hooks/useDuplicateEmail';
import useEmail from '../hooks/useEmail';
import useEmailTargets from '../hooks/useEmailTargets';
import { ZetkinEmail } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

import { useMessages } from 'core/i18n';

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
  const { data: targets } = useEmailTargets(orgId, email.id);

  return (
    <Box alignItems="flex-end" display="flex" flexDirection="column" gap={1}>
      <Box display="flex">
        <Button
          disabled={targets?.allTargets === 0 || emailState === EmailState.SENT}
          endIcon={<ArrowDropDown />}
          onClick={(event) =>
            setAnchorEl(anchorEl ? null : event.currentTarget)
          }
          variant="contained"
        >
          {messages.emailActionButtons.delevery()}
        </Button>
        <Popper anchorEl={anchorEl} open={!!anchorEl} placement="bottom-end">
          <EmailDeliveryPanel
            email={email}
            onClose={() => setAnchorEl(null)}
            orgId={orgId}
            targetNum={targets?.allTargets || 0}
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
      {email.published && (
        <DeliveryStatusSpan
          emailState={emailState}
          published={email.published}
          sendingTime={removeOffset(email.published.slice(11, 16))}
        />
      )}
    </Box>
  );
};

export default EmailActionButtons;
