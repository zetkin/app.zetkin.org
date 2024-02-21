import { Box } from '@mui/system';
import { AccessTime, Send } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { removeOffset } from 'utils/dateUtils';
import { Typography } from '@mui/material';
import { ZetkinEmail } from 'utils/types/zetkin';
import ZUIDateSpan from 'zui/ZUIDateSpan';

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
          <AccessTime sx={{ mr: 1 }} />
        ) : (
          <Send sx={{ mr: 1 }} />
        )}
        <Msg
          id={
            sendTime <= now
              ? messageIds.deliveryStatus.wasSent
              : messageIds.deliveryStatus.willSend
          }
          values={{ time: removeOffset(email.published.slice(11, 16)) }}
        />
        {', '}
        <ZUIDateSpan
          end={new Date(email.published)}
          start={new Date(email.published)}
        />
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
