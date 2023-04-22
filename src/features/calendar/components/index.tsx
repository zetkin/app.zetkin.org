import { useState } from 'react';

import CalendarNavBar from './CalendarNavBar';
import dayjs from 'dayjs';

export enum TimeScale {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

const Calendar = () => {
  const [focusDate, setFocusDate] = useState<Date>(new Date());
  const [selectedTimeScale, setSelectedTimeScale] = useState<TimeScale>(
    TimeScale.MONTH
  );

  return (
    <>
      <CalendarNavBar
        focusDate={focusDate}
        onChangeFocusDate={(date) => {
          setFocusDate(date);
        }}
        onChangeTimeScale={(timeScale) => {
          setSelectedTimeScale(timeScale);
        }}
        onStepBackward={() => {
          setFocusDate(
            dayjs(focusDate).subtract(1, selectedTimeScale).toDate()
          );
        }}
        onStepForward={() => {
          setFocusDate(dayjs(focusDate).add(1, selectedTimeScale).toDate());
        }}
        timeScale={selectedTimeScale}
      />

      {selectedTimeScale === TimeScale.DAY && <h2>Day</h2>}
      {selectedTimeScale === TimeScale.WEEK && <h2>Week</h2>}
      {selectedTimeScale === TimeScale.MONTH && <h2>Month</h2>}
    </>
  );
};

export default Calendar;
