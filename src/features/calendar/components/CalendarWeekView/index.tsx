import _ from 'lodash';
import { Box } from '@mui/system';
import { FormattedTime } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import theme from 'theme';

dayjs.extend(isoWeek);

export interface DayHeaderProps {
  date: Dayjs;
  focused: boolean;
}

const DayHeader = ({ date, focused }: DayHeaderProps) => {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-start"
        width="2em"
      >
        <Typography color={theme.palette.grey[500]} variant="subtitle2">
          {
            // Localized short-format weeekday
            date.toDate().toLocaleDateString(undefined, { weekday: 'short' })
          }
        </Typography>
      </Box>
      <Box>
        <Box
          display="flex"
          sx={{
            alignItems: 'center',
            backgroundColor: focused ? theme.palette.primary.main : null,
            borderRadius: '50%',
            color: focused ? 'white' : 'inherit',
            height: '2.1em',
            justifyContent: 'center',
            width: '2.1em',
          }}
        >
          <Typography color={focused ? 'white' : 'inherit'} fontSize="1.2em">
            {date.format('D')}
          </Typography>
        </Box>
      </Box>
      <Box width="2em"></Box>
    </Box>
  );
};

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
    <Box
      columnGap={1}
      display="grid"
      gridTemplateColumns={'auto repeat(7, 1fr)'}
      gridTemplateRows={'auto 1fr'}
      rowGap={1}
    >
      {/* Week Number */}
      <Box alignItems="center" display="flex">
        <Typography color={theme.palette.grey[500]} variant="caption">
          {focusWeekStartDay.isoWeek()}
        </Typography>
      </Box>
      {/* Day headers across the top */}
      {_.range(7).map((weekday: number) => {
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
      {/* Hours column */}
      <Box>
        {_.range(0, 24).map((hour: number) => {
          const time = dayjs().set('hour', hour).set('minute', 0);
          return (
            <Box key={hour} display="flex" height={`${HOUR_HEIGHT}em`}>
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
      {_.range(7).map((weekday: number) => {
        return (
          <Box
            key={weekday}
            flexGrow={1}
            height={`${HOUR_HEIGHT * 24}em`}
            sx={{
              backgroundImage: `repeating-linear-gradient(180deg, ${theme.palette.grey[400]}, ${theme.palette.grey[400]} 1px, ${theme.palette.grey[200]} 1px, ${theme.palette.grey[200]} ${HOUR_HEIGHT}em)`,
              marginTop: '0.6em', // Aligns the hour marker on each day to the hour on the hour column
            }}
          ></Box>
        );
      })}
    </Box>
  );
};

export default CalendarWeekView;
