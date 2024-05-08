import { Box } from '@mui/system';
import { AccessTime, Send } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { Typography } from '@mui/material';
import { ZetkinEmail } from 'utils/types/zetkin';
import ZUIDateTime from 'zui/ZUIDateTime';

interface DeliveryStatusMessageProps {
  email: ZetkinEmail;
}
const DeliveryStatusMessage = ({ email }: DeliveryStatusMessageProps) => {
  if (email.locked && email.published) {
    const sendTime = new Date(email.published);
    const now = new Date();

    return (
      <Box alignItems="center" display="flex">
        {sendTime <= now ? (
          <AccessTime color="secondary" sx={{ mr: 1 }} />
        ) : (
          <Send color="secondary" sx={{ mr: 1 }} />
        )}
        <Typography color="secondary">
          <Msg
            id={
              sendTime <= now
                ? messageIds.deliveryStatus.wasSent
                : messageIds.deliveryStatus.willSend
            }
            values={{
              datetime: (
                <ZUIDateTime convertToLocal datetime={email.published} />
              ),
            }}
          />
        </Typography>
      </Box>
    );
  }

  return (
    <Typography color="secondary">
      <Msg
        id={
          email.locked
            ? messageIds.deliveryStatus.notScheduled
            : messageIds.deliveryStatus.notLocked
        }
      />
    </Typography>
  );
};

export default DeliveryStatusMessage;
