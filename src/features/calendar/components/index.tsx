import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CalendarDayView from './CalendarDayView';
import CalendarMonthView from './CalendarMonthView';
import CalendarNavBar from './CalendarNavBar';
import CalendarWeekView from './CalendarWeekView';

export enum TimeScale {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

function getTimeScale(timeScaleStr: string) {
  let timeScale = TimeScale.MONTH;
  if (
    timeScaleStr !== undefined &&
    Object.values(TimeScale).includes(timeScaleStr as TimeScale)
  ) {
    timeScale = timeScaleStr as TimeScale;
  }
  return timeScale;
}

function getDateFromString(focusDateStr: string) {
  let date = new Date();
  if (focusDateStr) {
    const d = dayjs(focusDateStr);
    if (d.isValid()) {
      date = d.toDate();
    }
  }
  return date;
}

const Calendar = () => {
  const router = useRouter();

  const focusDateStr = router.query.focusDate as string;
  const [focusDate, setFocusDate] = useState(getDateFromString(focusDateStr));

  const timeScaleStr = router.query.timeScale as string;
  const [selectedTimeScale, setSelectedTimeScale] = useState<TimeScale>(
    getTimeScale(timeScaleStr)
  );

  useEffect(() => {
    setFocusDate(getDateFromString(focusDateStr));
  }, [focusDateStr]);

  useEffect(() => {
    setSelectedTimeScale(getTimeScale(timeScaleStr));
  }, [timeScaleStr]);

  useEffect(() => {
    router.query.focusDate = dayjs(focusDate).format('YYYY-MM-DD');
    router.query.timeScale = selectedTimeScale;
    router.push(router, undefined, { shallow: true });
  }, [focusDate, selectedTimeScale]);

  function navigateTo(timeScale: TimeScale, date: Date) {
    setSelectedTimeScale(timeScale);
    setFocusDate(date);
  }

  return (
    <Box display="flex" flexDirection="column" height={'100%'} padding={2}>
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

      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        marginTop={2}
        overflow="auto"
      >
        {selectedTimeScale === TimeScale.DAY && <CalendarDayView />}
        {selectedTimeScale === TimeScale.WEEK && (
          <CalendarWeekView
            focusDate={focusDate}
            onClickDay={(date) => navigateTo(TimeScale.DAY, date)}
          />
        )}
        {selectedTimeScale === TimeScale.MONTH && (
          <CalendarMonthView
            focusDate={focusDate}
            onClickDay={(date) => navigateTo(TimeScale.DAY, date)}
            onClickWeek={(date) => navigateTo(TimeScale.WEEK, date)}
          />
        )}
      </Box>
    </Box>
  );
};

export default Calendar;
