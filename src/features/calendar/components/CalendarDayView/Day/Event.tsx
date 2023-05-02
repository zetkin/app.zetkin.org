import { FormattedTime } from 'react-intl';
import { Box, Typography } from '@mui/material';
import { PlaceOutlined, Schedule } from '@mui/icons-material';

import { ZetkinEvent } from 'utils/types/zetkin';

const Event = ({ event }: { event: ZetkinEvent }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      padding={2}
      sx={{ backgroundColor: 'white', borderRadius: '3px' }}
      width="100%"
    >
      <Box display="flex" gap={2.2}>
        <Typography>{event.title || event.activity.title}</Typography>
        {/* Time */}
        <Box display="flex">
          <Schedule />
          <Typography>
            <FormattedTime value={event.start_time} /> -
            <FormattedTime value={event.end_time} />
          </Typography>
        </Box>
        {/* Location */}
        {event.location && (
          <Box display="flex">
            <PlaceOutlined />
            <Typography>{event.location?.title}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Event;
