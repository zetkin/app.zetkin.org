import _ from 'lodash';
import { Box } from '@mui/system';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import theme from 'theme';

import messageIds from '../../l10n/messageIds';
import { useMessages } from 'core/i18n';

export interface DayHeaderProps {
  date: Dayjs;
  focused: boolean;
}

const TIME_COLUMN_WIDTH = '3em';
const HOUR_HEIGHT = 5;
const MARGINS_BETWEEN_COLUMNS = '0.7em';
const MARGIN_AFTER_TIME_COLUMN = '0.3em';

const DayHeader = ({ date, focused }: DayHeaderProps) => {
  return (
    <Box
      display="flex"
      flexGrow={1}
      justifyContent="space-between"
      marginBottom="0.7em"
      marginRight={MARGINS_BETWEEN_COLUMNS}
      sx={{ backgroundColor: date.date() % 2 == 0 ? 'blue' : 'green' }}
      width="100%"
    >
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-start"
        width="2em"
      >
        <Typography
          color={theme.palette.grey[500]}
          fontSize="1em"
          fontStyle="bold"
        >
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
            backgroundColor: focused ? theme.palette.statusColors.blue : '',
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

export interface CalendarWeekViewProps {
  focusDate: Date;
}

const CalendarWeekView = ({ focusDate }: CalendarWeekViewProps) => {
  const messages = useMessages(messageIds);
  dayjs.extend(isoWeek);
  const correctWeek =
    dayjs(focusDate).isoWeekday() == 7
      ? dayjs(focusDate).add(-1, 'day')
      : focusDate;
  const week = dayjs(correctWeek).isoWeek();

  return (
    <Box display="flex" flexDirection="column" flexGrow={0} height="100%">
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
        <Box
          alignItems="flex-start"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          marginRight={MARGIN_AFTER_TIME_COLUMN}
          sx={{
            color: theme.palette.statusColors.red,
            fontSize: '1em',
            fontWeight: 'bold',
            marginTop: '1.3em',
            width: TIME_COLUMN_WIDTH,
          }}
        >
          {messages.weekCalendar.week()}
          {week}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          flexGrow={1}
          marginTop="1em"
          width="100%"
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
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            color: theme.palette.grey[500],
            fontSize: '1em',
            height: `${HOUR_HEIGHT * 24}em`,
            marginRight: MARGIN_AFTER_TIME_COLUMN,
            marginTop: `${HOUR_HEIGHT - 0.8}em`,
            width: TIME_COLUMN_WIDTH,
          }}
        >
          {_.range(1, 24).map((hour: number) => (
            <Box key={hour} sx={{ height: `${HOUR_HEIGHT}em` }}>
              <Box
                display="flex"
                justifyContent="flex-end"
                width={TIME_COLUMN_WIDTH}
              >
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
              height={`${HOUR_HEIGHT * 24}em`}
              sx={{
                backgroundImage: `repeating-linear-gradient(180deg, ${theme.palette.grey[400]}, ${theme.palette.grey[400]} 1px, ${theme.palette.grey[200]} 1px, ${theme.palette.grey[200]} ${HOUR_HEIGHT}em)`,
                marginRight: MARGINS_BETWEEN_COLUMNS,
              }}
            ></Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CalendarWeekView;
