import { Box } from '@mui/system';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import React from 'react';

import CalendarMonthViewDay from './CalendarMonthViewDay';

type CalendarWeekNumberProps = {
  weekNr: number;
};

const CalendarWeekNumber = ({ weekNr }: CalendarWeekNumberProps) => {
  return (
    <>
      <Box
        color="#9f9f9f"
        fontSize="0.75rem"
        height="100%"
        padding="7px"
        width="100%"
      >
        {weekNr}
      </Box>
    </>
  );
};

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
        bgcolor="#f5f5f5"
        display="grid"
        flexGrow="1"
        gap="8px"
        gridTemplateColumns={`auto repeat(${numberOfColumns}, 1fr)`}
        gridTemplateRows={`repeat(${numberOfRows}, 1fr)`}
        margin="12px"
      >
        {[...Array(numberOfRows)].map((_, rowIndex) =>
          [...Array(numberOfColumns + 1)].map((_, columnIndex) => (
            <React.Fragment key={`${rowIndex * numberOfColumns + columnIndex}`}>
              {columnIndex === 0 && (
                <CalendarWeekNumber weekNr={getWeekNumber(rowIndex)} />
              )}
              {columnIndex !== 0 && (
                <CalendarMonthViewDay
                  currentDate={currentDate}
                  dayIndex={getDayIndex(rowIndex, columnIndex - 1)}
                  firstDateOfCalendar={firstDayOfCalendar}
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
