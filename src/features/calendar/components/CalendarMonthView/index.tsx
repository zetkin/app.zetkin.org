import { Box } from '@mui/system';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import React from 'react';

import Day from './Day';
import WeekNumber from './WeekNumber';
import { getDayIndex, getDaysBeforeFirstDay, getWeekNumber } from './utils';

dayjs.extend(isoWeek);

type CalendarMonthViewProps = {
  focusDate: Date;
};

const CalendarMonthView = ({ focusDate }: CalendarMonthViewProps) => {
  const numberOfRows = 6;
  const numberOfColumns = 7;

  const firstDayOfMonth: Date = new Date(
    focusDate.getFullYear(),
    focusDate.getMonth(),
    1
  );
  const firstDayOfCalendar: Date = dayjs(firstDayOfMonth)
    .subtract(getDaysBeforeFirstDay(firstDayOfMonth), 'day')
    .toDate();

  return (
    <Box
      display="grid"
      flexGrow="1"
      gap="8px"
      gridTemplateColumns={`auto repeat(${numberOfColumns}, 1fr)`}
      gridTemplateRows={`repeat(${numberOfRows}, 1fr)`}
    >
      {[...Array(numberOfRows)].map((_, rowIndex) =>
        [...Array(numberOfColumns + 1)].map((_, columnIndex) => {
          //First item in each column is the week number
          if (columnIndex === 0) {
            return (
              <WeekNumber
                key={rowIndex * numberOfColumns + columnIndex}
                weekNr={getWeekNumber(firstDayOfCalendar, rowIndex)}
              />
            );
          }

          const date = dayjs(firstDayOfCalendar)
            .add(getDayIndex(rowIndex, columnIndex, numberOfColumns), 'day')
            .toDate();

          // Remaining items are days
          return (
            <Day
              key={rowIndex * numberOfColumns + columnIndex}
              date={date}
              isInFocusMonth={dayjs(date).month() === focusDate.getMonth()}
            />
          );
        })
      )}
    </Box>
  );
};

export default CalendarMonthView;
