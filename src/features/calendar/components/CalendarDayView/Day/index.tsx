import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';
import { Box, Typography } from '@mui/material';

import { DayInfo } from '../types';
import Event from './Event';
import theme from 'theme';

const Day = ({ date, dayInfo }: { date: Date; dayInfo: DayInfo }) => {
  const isToday = dayjs(date).isSame(dayjs(), 'day');
  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flexDirection="row"
      gap={4}
      padding={1}
      sx={{
        backgroundColor: '#eeeeee',
      }}
    >
      {/* Date */}
      <Box
        alignItems="center"
        display="flex"
        gap={1}
        sx={{
          backgroundColor: isToday ? theme.palette.primary.main : undefined,
          borderRadius: '20%/50%',
          color: isToday ? 'white' : 'inherit',
          padding: '10px 15px',
        }}
      >
        <Typography fontSize="1.4em" variant="h4">
          <FormattedDate day="numeric" value={date} />
        </Typography>
        <Typography variant="body1">
          <FormattedDate month="long" value={date} />
          ,&nbsp;
          <FormattedDate value={date} weekday="short" />
        </Typography>
      </Box>
      {/* Remaining space for list of events */}
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        gap={1}
        justifyItems="flex-start"
      >
        {dayInfo.events.map((event, index) => {
          return <Event key={index} event={event} />;
        })}
      </Box>
    </Box>
  );
};

export default Day;
