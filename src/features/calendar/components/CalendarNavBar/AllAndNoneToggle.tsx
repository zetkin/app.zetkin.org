import { Box, Button, ButtonGroup } from '@mui/material';
import { Msg } from 'core/i18n';
import React from 'react';
import messageIds from 'features/calendar/l10n/messageIds';

const AllAndNoneToggle = () => {
  return (
    <Box display="flex">
      <Button variant="text">
        <Msg id={messageIds.eventFilter.toggle.all} />
      </Button>
      <Button disabled variant="text">
        <Msg id={messageIds.eventFilter.toggle.none} />
      </Button>
    </Box>
  );
};

export default AllAndNoneToggle;
