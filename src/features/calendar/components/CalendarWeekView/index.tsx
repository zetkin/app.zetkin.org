import _ from 'lodash';
import { Box } from '@mui/system';
import { Grid, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import theme from 'theme';

export interface DayHeaderProps {
  date: Dayjs;
  focused: boolean;
}

const DayHeader = ({ date, focused }: DayHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          color: theme.palette.grey,
          display: 'flex',
          fontSize: '0.7em',
          justifyContent: 'flex-start',
        }}
      >
        <Typography sx={{ fontStyle: 'bold' }}>{date.format('ddd')}</Typography>
      </Box>
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: focused ? theme.palette.statusColors.blue : '',
            borderRadius: '50%',
            color: focused ? 'white' : 'inherit',
            fontSize: '1.2em',
            height: '1.7em',
            textAlign: 'center',
            width: '1.7em',
          }}
        >
          {date.format('D')}
        </Box>
      </Box>
      <Box></Box>
    </Box>
  );
};

export interface CalendarWeekViewProps {
  focusDate: Date;
}

const TIME_COLUMN_WIDTH = '3em';

const CalendarWeekView = ({ focusDate }: CalendarWeekViewProps) => {
  const isoWeek = require('dayjs/plugin/isoWeek');
  dayjs.extend(isoWeek);
  const correctWeek =
    dayjs(focusDate).isoWeekday() == 7
      ? dayjs(focusDate).add(-1, 'day')
      : focusDate;
  const week = dayjs(correctWeek).isoWeek();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        height: '100%',
      }}
    >
      <Box display="flex" flexDirection="row">
        <Box
          sx={{
            alignItems: 'flex-end',
            display: 'flex',
            width: TIME_COLUMN_WIDTH,
          }}
        >
          {'w' + week + ''}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'space-around',
            marginTop: '1em',
          }}
        >
          {_.range(7).map((weekday: number) => {
            const weekdayDate = dayjs(correctWeek).day(weekday + 1);

            return (
              <DayHeader
                key={weekday}
                date={weekdayDate}
                focused={
                  new Date().toDateString() ==
                  weekdayDate.toDate().toDateString()
                }
              />
            );
          })}
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Box sx={{ marginTop: '2em', width: TIME_COLUMN_WIDTH }}>
          {_.range(24).map((hour: number) => (
            <Box key={hour} sx={{ height: '5em' }}>
              <Box display="flex" width={TIME_COLUMN_WIDTH}>
                {hour}.00
              </Box>
            </Box>
          ))}
        </Box>
        {_.range(7).map((weekday: number) => {
          return (
            <Box
              key={weekday}
              flexGrow={1}
              height="120em"
              sx={{
                backgroundImage: `repeating-linear-gradient(180deg, black 0, ${theme.palette.divider} 1px, ${theme.palette.grey[200]} 1px, ${theme.palette.grey[200]} 5em)`,
                marginLeft: '1em',
              }}
            ></Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CalendarWeekView;
