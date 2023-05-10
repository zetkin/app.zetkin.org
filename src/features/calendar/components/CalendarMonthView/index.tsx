import { Box } from '@mui/material';
import React from 'react';

import Day from './Day';
import dayjs from 'dayjs';
import range from 'utils/range';
import WeekNumber from './WeekNumber';
import { getDaysBeforeFirstDay, getWeekNumber } from './utils';

export const numberOfRows = 6;
export const numberOfDayColumns = 7;
export const numberOfGridColumns = 8;

type CalendarMonthViewProps = {
  focusDate: Date;
  onClickDay: (date: Date) => void;
  onClickWeek: (date: Date) => void;
};

const CalendarMonthView = ({
  focusDate,
  onClickDay,
  onClickWeek,
}: CalendarMonthViewProps) => {
  const firstDayOfMonth: Date = new Date(
    focusDate.getFullYear(),
    focusDate.getMonth(),
    1
  );
  const firstDayOfCalendar: Date = dayjs(firstDayOfMonth)
    .subtract(getDaysBeforeFirstDay(firstDayOfMonth), 'day')
    .toDate();

  function onClickWeekHandler(rowIndex: number) {
    onClickWeek(dayjs(firstDayOfCalendar).add(rowIndex, 'week').toDate());
  }

  return (
    <Box
      display="grid"
      flexGrow="1"
      gap="8px"
      gridTemplateColumns={`auto repeat(${numberOfDayColumns}, 1fr)`}
      gridTemplateRows={`repeat(${numberOfRows}, 1fr)`}
    >
      {
        // Creates 6 rows
        range(numberOfRows).map((rowIndex) =>
          // Creates 8 items in each row
          range(numberOfGridColumns).map((columnIndex) => {
            const gridItemKey = columnIndex + rowIndex * numberOfGridColumns;

            // First item in each row is the week number
            if (columnIndex === 0) {
              return (
                <WeekNumber
                  key={gridItemKey}
                  onClick={() => onClickWeekHandler(columnIndex)}
                  weekNr={getWeekNumber(firstDayOfCalendar, rowIndex)}
                />
              );
            }

            // Remaining items in each row are days
            const dayIndex = columnIndex - 1 + rowIndex * numberOfDayColumns; // Index of the day within the day grid
            const date = dayjs(firstDayOfCalendar)
              .add(dayIndex, 'day')
              .toDate();

            const isInFocusMonth = date.getMonth() === focusDate.getMonth();

            return (
              <Day
                key={gridItemKey}
                date={date}
                isInFocusMonth={isInFocusMonth}
                onClick={onClickDay}
              />
            );
          })
        )
      }
    </Box>
  );
};

export default CalendarMonthView;
