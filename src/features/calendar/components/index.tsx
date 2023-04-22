import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

import CalendarDayView from './CalendarDayView';
import CalendarMonthView from './CalendarMonthView';
import CalendarNavBar from './CalendarNavBar';
import CalendarWeekView from './CalendarWeekView';

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
    <Grid padding={2}>
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

      {selectedTimeScale === TimeScale.DAY && <CalendarDayView focusDate={focusDate} />}
      {selectedTimeScale === TimeScale.WEEK && <CalendarWeekView />}
      {selectedTimeScale === TimeScale.MONTH && <CalendarMonthView />}
    </Grid>
  );
};

export default Calendar;
