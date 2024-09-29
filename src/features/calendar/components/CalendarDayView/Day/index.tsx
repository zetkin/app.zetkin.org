import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import dayjs from 'dayjs';

import DateLabel from './DateLabel';
import { DaySummary, getDSTOffset } from '../../utils';
import Event from './Event';
import messageIds from 'features/calendar/l10n/messageIds';
import theme from 'theme';
import { Msg } from 'core/i18n';

const Day = ({ date, dayInfo }: { date: Date; dayInfo: DaySummary }) => {
  const dstOffset = useMemo(
    () =>
      getDSTOffset(dayjs(date).startOf('day').toDate()) -
      getDSTOffset(dayjs(date).endOf('day').toDate()),
    [date]
  );

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
      <Box display="flex" flexDirection="column" width={'200px'}>
        <DateLabel date={date} />
        {dstOffset !== 0 && (
          <Box padding="8px 12px">
            <Typography color={theme.palette.grey[600]} variant="body2">
              {dstOffset > 0 && <Msg id={messageIds.dstStarts} />}
              {dstOffset < 0 && <Msg id={messageIds.dstEnds} />}
            </Typography>
          </Box>
        )}
      </Box>
      {/* Remaining space for list of events */}
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        gap={1}
        justifyItems="flex-start"
      >
        {dayInfo.events
          .sort(
            (a, b) =>
              new Date(a.data.start_time).getTime() -
              new Date(b.data.start_time).getTime()
          )
          .map((event, index) => {
            return <Event key={index} event={event.data} />;
          })}
      </Box>
    </Box>
  );
};

export default Day;
