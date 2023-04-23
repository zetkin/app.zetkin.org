import { Box } from '@mui/material';
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
    TimeScale.WEEK
  );

  return (
    <Box display="flex" flexDirection="column" height={'100%'} padding={2}>
      <Box>
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
      </Box>

      <Box flexGrow={1}>
        {selectedTimeScale === TimeScale.DAY && <CalendarDayView />}
        {selectedTimeScale === TimeScale.WEEK && <CalendarWeekView focusDate={focusDate} />}
        {selectedTimeScale === TimeScale.MONTH && <CalendarMonthView />}
      </Box>
    </Box>
  );
};

export default Calendar;
