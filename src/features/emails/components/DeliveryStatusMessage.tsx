import { Box } from '@mui/system';
import { AccessTime, Send } from '@mui/icons-material';

import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIDateSpan from 'zui/ZUIDateSpan';

interface DeliveryStatusMessageProps {
  emailState: EmailState;
  published: string;
  sendingTime: string;
}
const DeliveryStatusMessage = ({
  emailState,
  published,
  sendingTime,
}: DeliveryStatusMessageProps) => {
  return (
    <>
      {''}
      {(emailState === EmailState.SENT ||
        emailState === EmailState.SCHEDULED) && (
        <Box alignItems="center" display="flex">
          {emailState === EmailState.SENT ? (
            <AccessTime sx={{ mr: 1 }} />
          ) : (
            <Send sx={{ mr: 1 }} />
          )}
          <Msg
            id={
              emailState === EmailState.SENT
                ? messageIds.wasSent
                : messageIds.willSend
            }
            values={{ time: sendingTime }}
          />
          {', '}
          <ZUIDateSpan end={new Date(published)} start={new Date(published)} />
        </Box>
      )}
    </>
  );
};

export default DeliveryStatusMessage;
