import { Box } from '@mui/material';
import dayjs from 'dayjs';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import {
  EmojiPeople,
  FaceRetouchingOff,
  MailOutline,
} from '@mui/icons-material';

import theme from 'theme';
import { ZetkinEvent } from 'utils/types/zetkin';

export enum STATUS_COLORS {
  BLUE = 'blue',
  GREEN = 'green',
  GRAY = 'gray',
  ORANGE = 'orange',
  RED = 'red',
}

const CalendarDayViewActivity = ({
  event,
  statusColor = STATUS_COLORS.GREEN,
}: {
  event: ZetkinEvent;
  statusColor: STATUS_COLORS;
}) => {
  return (
    <>
      <Box
        style={{
          backgroundColor: 'white',
          border: '1px secondary solid',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: '1em',
          width: '100%',
        }}
        // TODO: On Click open event popper
      >
        <Box
          style={{
            display: 'flex',
            gap: '1em',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: theme.palette.statusColors[statusColor],
                borderRadius: '100%',
                height: '10px',
                width: '10px',
              }}
            ></div>
          </Box>

          <Box
            style={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1em',
            }}
          >
            <Box display="flex" gap="0.1em">
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <EventIcon />
              </span>
              <span>{event.title || event.activity.title}</span>
            </Box>
            <Box
              style={{
                alignItems: 'center',
                color: theme.palette.text.secondary,
                display: 'flex',
                gap: '0.1em',
              }}
            >
              <ScheduleIcon />
              <Box>
                <span>{dayjs(event.start_time).format('HH:mm')}</span>
                {event.end_time && (
                  <span> - {dayjs(event.end_time).format('HH:mm')}</span>
                )}
              </Box>
            </Box>
            <Box
              style={{
                alignItems: 'center',
                color: theme.palette.text.secondary,
                display: 'flex',
                gap: '0.1em',
              }}
            >
              <PlaceOutlinedIcon />
              <span>{event.location.title}</span>
            </Box>
          </Box>
        </Box>
        <Box
          style={{
            alignItems: 'center',
            color: 'secondary',
            display: 'flex',
            gap: '1em',
          }}
        >
          {/* <EventWarningIcons/> */}
          {/* TODO: Pass in data to EventWarningIcons component */}
          <Box display="flex">
            <EmojiPeople color="error" />
            <FaceRetouchingOff color="error" />
            <MailOutline color="error" />
          </Box>
          <Box
            style={{
              alignItems: 'center',
              display: 'flex',
              gap: '0.5em',
            }}
          >
            <PeopleIcon />
            <span>
              {event.num_participants_available}/
              {event.num_participants_required}
            </span>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CalendarDayViewActivity;
