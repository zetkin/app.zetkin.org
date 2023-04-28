import React from 'react';

import CalendarMonthGrid from './CalendarMonthGrid';
import Day from './Day';

type CalendarMonthViewProps = {
  focusDate: Date;
};

const CalendarMonthView = ({ focusDate }: CalendarMonthViewProps) => {
  return (
    <CalendarMonthGrid
      focusDate={focusDate}
      renderDay={(date, isInFocusMonth) => {
        return <Day date={date} isInFocusMonth={isInFocusMonth} />;
      }}
    />
  );
};

export default CalendarMonthView;
