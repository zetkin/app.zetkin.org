import { FormattedTime } from 'react-intl';
import { Box, Typography } from '@mui/material';
import {
  EmojiPeople,
  FaceRetouchingOff,
  MailOutline,
  People,
  PlaceOutlined,
  Schedule,
} from '@mui/icons-material';

import theme from 'theme';
import { ZetkinEvent } from 'utils/types/zetkin';

const Event = ({ event }: { event: ZetkinEvent }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      padding={2}
      sx={{ backgroundColor: 'white', borderRadius: '3px' }}
      width="100%"
    >
      <Box alignItems="center" display="flex" gap={2.2}>
        {/* Status */}
        <Box
          sx={{
            backgroundColor: 'green',
            borderRadius: '50%',
            height: '10px',
            width: '10px',
          }}
        />
        {/* Title */}
        <Typography>{event.title || event.activity.title}</Typography>
        {/* Time */}
        <Typography color={theme.palette.secondary.main} component={'div'}>
          <Box alignItems="center" display="flex" gap={0.5}>
            <Schedule />
            <FormattedTime
              hour="numeric"
              hour12={false}
              minute="numeric"
              value={event.start_time}
            />
            &nbsp;-&nbsp;
            <FormattedTime
              hour="numeric"
              hour12={false}
              minute="numeric"
              value={event.end_time}
            />
          </Box>
        </Typography>
        {/* Location */}
        {event.location && (
          <Typography color={theme.palette.secondary.main} component={'div'}>
            <Box alignItems="center" display="flex" gap={0.5}>
              <PlaceOutlined />
              {event.location?.title}
            </Box>
          </Typography>
        )}
      </Box>
      {/* Icons */}
      <Box alignItems="center" display="flex" gap={1}>
        <EmojiPeople color="error" />
        <FaceRetouchingOff color="error" />
        <MailOutline color="error" />
        <People />
        <Typography>
          {event.num_participants_available}/{event.num_participants_required}
        </Typography>
      </Box>
    </Box>
  );
};

export default Event;
