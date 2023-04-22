import { useState } from 'react';

import CalendarNavBar from './CalendarNavBar';

export enum TimeScale {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

const Calendar = () => {
  const [focusDate, setFocusDate] = useState<Date>(new Date());
  //   const [selectedTimeScale, setSelectedTimeScale] = useState<TimeScale>(
  //     TimeScale.MONTH
  //   );

  //   onChangeTimeScale={() => {}}
  //         onStepBackward={() => {}}
  //         onStepForward={() => {}}
  //   timeScale={selectedTimeScale}

  return (
    <>
      <CalendarNavBar
        focusDate={focusDate}
        onChangeFocusDate={(date) => {
          setFocusDate(date);
        }}
      />
    </>
  );
};

export default Calendar;
