import { Box } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

const EmailActionButtons = () => {
  const messages = useMessages(messageIds);
  return (
    <Box alignItems="flex-end" display="flex" flexDirection="column" gap={1}>
      <Box display="flex">
        <ZUIButtonMenu
          items={[]}
          label={messages.emailActionButtons.delevery()}
        />
        <ZUIEllipsisMenu
          items={[
            {
              label: <>{messages.emailActionButtons.duplicate()}</>,
              startIcon: <ContentCopy />,
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default EmailActionButtons;
