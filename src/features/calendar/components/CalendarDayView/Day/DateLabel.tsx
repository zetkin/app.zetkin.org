import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';
import { Box, Typography } from '@mui/material';

import theme from 'theme';

const DateLabel = ({ date }: { date: Date }) => {
  const isToday = dayjs(date).isSame(dayjs(), 'day');
  const isThePast = dayjs(date).isBefore(dayjs(), 'day');
  return (
    <Box
      alignItems="center"
      display="flex"
      gap={1}
      sx={{
        backgroundColor: isToday ? theme.palette.primary.main : undefined,
        borderRadius: '20%/50%',
        color: isToday
          ? // White colour if today
            'white'
          : isThePast
          ? // Grey if it's the past
            theme.palette.secondary.main
          : // Default colour if it's the future
            'inherit',
        padding: '8px 12px',
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
  );
};

export default DateLabel;
