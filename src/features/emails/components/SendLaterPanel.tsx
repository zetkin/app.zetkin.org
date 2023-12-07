import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { TimeField } from '@mui/x-date-pickers-pro';
import { Box, Stack } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUITimezonePicker from 'zui/ZUITimezonePicker';

const SendLaterPanel = () => {
  const messages = useMessages(messageIds);

  return (
    <Box display="flex" flexDirection="column" mt={2}>
      <Box display="flex" flex={1} pr={1} width={'50%'}>
        <DatePicker
          format="DD-MM-YYYY"
          label={messages.emailActionButtons.deliveryDate()}
          sx={{ marginBottom: 2 }}
          value={dayjs(new Date())}
        />
      </Box>
      <Stack direction="row" spacing={2}>
        <TimeField
          ampm={false}
          format="HH:mm"
          fullWidth
          label={messages.emailActionButtons.deliveryTime()}
          value={dayjs(new Date())}
        />
        <ZUITimezonePicker />
      </Stack>
    </Box>
  );
};

export default SendLaterPanel;
