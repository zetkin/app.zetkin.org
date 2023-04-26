import { Box } from '@mui/system';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import React from 'react';

import Day from './Day';
import WeekNumber from './WeekNumber';

type Props = {
  focusDate: Date;
};
const CalendarMonthView = ({ focusDate }: Props) => {
  const numberOfRows = 6;
  const numberOfColumns = 7;

  const firstDayOfMonth = new Date(
    focusDate.getFullYear(),
    focusDate.getMonth(),
    1
  );
  function getDaysBeforeFirstDay() {
    const daysBeforeFirstDay = firstDayOfMonth.getDay();
    if (daysBeforeFirstDay === 0) {
      return 6;
    } else {
      return daysBeforeFirstDay - 1;
    }
  }

  const daysBeforeFirstDay = getDaysBeforeFirstDay();
  const firstDayOfCalendar = dayjs(firstDayOfMonth).subtract(
    daysBeforeFirstDay,
    'day'
  );
  const currentDate = new Date();

  dayjs.extend(isoWeek);
  function getDayIndex(rowIndex: number, columnIndex: number) {
    return columnIndex + rowIndex * numberOfColumns;
  }
  function getWeekNumber(rowIndex: number) {
    return firstDayOfCalendar.add(rowIndex, 'week').isoWeek();
  }

  return (
    <>
      <Box
        display="grid"
        flexGrow="1"
        gap="8px"
        gridTemplateColumns={`auto repeat(${numberOfColumns}, 1fr)`}
        gridTemplateRows={`repeat(${numberOfRows}, 1fr)`}
      >
        {[...Array(numberOfRows)].map((_, rowIndex) =>
          [...Array(numberOfColumns + 1)].map((_, columnIndex) => (
            <React.Fragment key={`${rowIndex * numberOfColumns + columnIndex}`}>
              {/* First item in each row is the week number */}
              {columnIndex === 0 && (
                <WeekNumber weekNr={getWeekNumber(rowIndex)} />
              )}
              {/* Following items are days */}
              {columnIndex > 0 && (
                <Day
                  currentDate={currentDate}
                  dayIndex={getDayIndex(rowIndex, columnIndex - 1)}
                  firstDateOfCalendar={firstDayOfCalendar.toDate()}
                  focusDate={focusDate}
                />
              )}
            </React.Fragment>
          ))
        )}
      </Box>
    </>
  );
};

export default CalendarMonthView;
