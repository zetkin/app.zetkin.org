import { FC } from 'react';
import { Box, Card, TextField } from '@mui/material';

import messageIds from './l10n/messageIds';
import { useMessages } from 'core/i18n';

const ZUIEventDetailsCard: FC = () => {
  const messages = useMessages(messageIds);
  return (
    <Card>
      <Box display="flex" justifyContent="space-between" m={2}></Box>
      <Box
        m={2}
        sx={{
          alignSelf: 'stretch',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TextField
          id="outlined-basic"
          label="Start"
          variant="outlined"
        ></TextField>

        <TextField id="outlined-basic" label="End" variant="outlined" />
        <TextField id="outlined-basic" label="Location" variant="outlined" />
      </Box>
      <Box m={2}>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Link"
          variant="outlined"
        />
      </Box>
      <Box m={2}>
        <TextField
          placeholder={messages.eventDetailsCard.description()}
        ></TextField>
      </Box>
    </Card>
  );
};

export default ZUIEventDetailsCard;
