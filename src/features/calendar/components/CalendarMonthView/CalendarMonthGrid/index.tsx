import { Box } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

import WeekNumber from './WeekNumber';
import {
  getDayIndex,
  getDaysBeforeFirstDay,
  getWeekNumber,
  range,
} from '../utils';

export const numberOfRows = 6;
export const numberOfColumns = 7;

export interface CalendarMonthGridProps {
  focusDate: Date;
  /**
   * Renders each day in the calendar view in order
   */
  renderDay: (date: Date, isInFocusMonth: boolean) => React.ReactElement;
}

/**
 * Renders a grid of dates spanning 6 weeks. Each week shows the week number in the year.
 */
const CalendarMonthGrid = ({
  focusDate,
  renderDay,
}: CalendarMonthGridProps) => {
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
      {
        // Creates 6 rows
        range(numberOfRows).map((rowIndex) =>
          // Creates 8 items in each row
          range(numberOfColumns + 1).map((columnIndex) => {
            // First item in each row is the week number
            if (columnIndex === 0) {
              return (
                <WeekNumber
                  key={getDayIndex(rowIndex, columnIndex, numberOfColumns)}
                  weekNr={getWeekNumber(firstDayOfCalendar, rowIndex)}
                />
              );
            }

            // Remaining items in each row are days
            const date = dayjs(firstDayOfCalendar)
              .add(getDayIndex(rowIndex, columnIndex, numberOfColumns), 'day')
              .toDate();

            const isInFocusMonth = date.getMonth() === focusDate.getMonth();

            return (
              <React.Fragment
                key={getDayIndex(rowIndex, columnIndex, numberOfColumns)}
              >
                {
                  // Render the day with the provided date
                  renderDay(date, isInFocusMonth)
                }
              </React.Fragment>
            );
          })
        )
      }
    </Box>
  );
};

export default CalendarMonthGrid;
