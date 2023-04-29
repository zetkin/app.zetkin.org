import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { FormattedTime } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Typography } from '@mui/material';

import DayHeader from './DayHeader';
import range from 'utils/range';
import theme from 'theme';

dayjs.extend(isoWeek);

const HOUR_HEIGHT = 5;

export interface CalendarWeekViewProps {
  focusDate: Date;
}

const CalendarWeekView = ({ focusDate }: CalendarWeekViewProps) => {
  const focusWeekStartDay =
    dayjs(focusDate).isoWeekday() == 7
      ? dayjs(focusDate).add(-1, 'day')
      : dayjs(focusDate);

  return (
    <>
      {/* Headers across the top */}
      <Box
        columnGap={1}
        display="grid"
        gridTemplateColumns={'50px repeat(7, 1fr)'}
        gridTemplateRows={'1fr'}
      >
        {/* Empty */}
        <Box />
        {range(7).map((weekday: number) => {
          const weekdayDate = focusWeekStartDay.day(weekday + 1);
          return (
            <DayHeader
              key={weekday}
              date={weekdayDate}
              focused={
                new Date().toDateString() == weekdayDate.toDate().toDateString()
              }
            />
          );
        })}
      </Box>
      {/* Week grid */}
      <Box
        columnGap={1}
        display="grid"
        gridTemplateColumns={'50px repeat(7, 1fr)'}
        gridTemplateRows={'1fr'}
        height="100%"
        marginTop={2}
        overflow="scroll"
      >
        {/* Hours column */}
        <Box>
          {range(24).map((hour: number) => {
            const time = dayjs().set('hour', hour).set('minute', 0);
            return (
              <Box
                key={hour}
                display="flex"
                height={`${HOUR_HEIGHT}em`}
                justifyContent="flex-end"
              >
                <Typography color={theme.palette.grey[500]} variant="caption">
                  <FormattedTime
                    hour="numeric"
                    hour12={false}
                    minute="numeric"
                    value={time.toDate()}
                  />
                </Typography>
              </Box>
            );
          })}
        </Box>
        {/* Day columns */}
        {range(7).map((weekday: number) => {
          return (
            <Box
              key={weekday}
              height={`${HOUR_HEIGHT * 24}em`}
              sx={{
                backgroundImage: `repeating-linear-gradient(180deg, ${theme.palette.grey[400]}, ${theme.palette.grey[400]} 1px, ${theme.palette.grey[200]} 1px, ${theme.palette.grey[200]} ${HOUR_HEIGHT}em)`,
                marginTop: '0.6em', // Aligns the hour marker on each day to the hour on the hour column
              }}
            ></Box>
          );
        })}
      </Box>
    </>
  );
};

export default CalendarWeekView;
