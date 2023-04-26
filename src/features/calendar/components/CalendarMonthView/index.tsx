import dayjs from 'dayjs';
import React from 'react';

import CalendarMonthGrid from './CalendarMonthGrid';
import Day from './Day';
import { getDaysBeforeFirstDay } from './utils';

type CalendarMonthViewProps = {
  focusDate: Date;
};

const CalendarMonthView = ({ focusDate }: CalendarMonthViewProps) => {
  const firstDayOfMonth: Date = new Date(
    focusDate.getFullYear(),
    focusDate.getMonth(),
    1
  );
  const firstDayOfCalendar: Date = dayjs(firstDayOfMonth)
    .subtract(getDaysBeforeFirstDay(firstDayOfMonth), 'day')
    .toDate();

  return (
    <CalendarMonthGrid
      firstDayOfCalendar={firstDayOfCalendar}
      renderDay={(date) => {
        return (
          <Day
            date={date}
            isInFocusMonth={dayjs(date).month() === focusDate.getMonth()}
          />
        );
      }}
    />
  );
};

export default CalendarMonthView;
