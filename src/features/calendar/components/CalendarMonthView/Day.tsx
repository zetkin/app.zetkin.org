import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';
import theme from 'theme';
import { Box, Typography } from '@mui/material';

import { AnyClusteredEvent } from 'features/calendar/utils/clusterEventsForWeekCalender';

type DayProps = {
  clusters: AnyClusteredEvent[];
  date: Date;
  isInFocusMonth: boolean;
  onClick: (date: Date) => void;
};

const Day = ({ clusters, date, isInFocusMonth, onClick }: DayProps) => {
  const isToday = dayjs(date).isSame(new Date(), 'day');

  let textColor = theme.palette.text.secondary;
  if (isToday) {
    textColor = theme.palette.primary.main;
  } else if (!isInFocusMonth) {
    textColor = '#dfdfdf';
  }

  return (
    <Box
      alignItems="stretch"
      bgcolor={isInFocusMonth ? '#eee' : 'none'}
      border="2px solid #eeeeee"
      borderColor={isToday ? theme.palette.primary.main : 'eee'}
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{
        overflowY: 'hidden',
      }}
      width="100%"
    >
      <Box marginLeft="5px">
        <Typography
          color={textColor}
          onClick={() => onClick(date)}
          sx={{
            cursor: 'pointer',
          }}
          variant="body2"
        >
          <FormattedDate day="numeric" value={date} />
        </Typography>
      </Box>
      {clusters.map((cluster, index) => {
        return (
          <Box
            key={index}
            sx={{
              // TODO: Replace this with real component
              backgroundColor: 'white',
              height: '20px',
              margin: '1px',
            }}
          >
            {cluster.kind} ({cluster.events.length})
          </Box>
        );
      })}
    </Box>
  );
};

export default Day;
