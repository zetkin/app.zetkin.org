import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useState } from 'react';
import utc from 'dayjs/plugin/utc';

import CalendarDayView from './CalendarDayView';
import CalendarMonthView from './CalendarMonthView';
import CalendarNavBar from './CalendarNavBar';
import CalendarWeekView from './CalendarWeekView';
import SelectionBar from '../../events/components/SelectionBar';
import useDayCalendarNav from '../hooks/useDayCalendarNav';
import useTimeScale from '../hooks/useTimeScale';

dayjs.extend(utc);

export enum TimeScale {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

function getDateFromString(focusDateStr: string) {
  let date = new Date();
  if (focusDateStr) {
    const d = dayjs.utc(focusDateStr);
    if (d.isValid()) {
      date = d.toDate();
    }
  }
  return date;
}

const Calendar = () => {
  const router = useRouter();

  const orgId = router.query.orgId;
  const campId = router.query.campId;

  const focusDateStr = router.query.focusDate as string;
  const [focusDate, setFocusDate] = useState(getDateFromString(focusDateStr));
  const { nextActivityDay, prevActivityDay } = useDayCalendarNav(focusDate);

  const { setPersistentTimeScale, timeScale } = useTimeScale(
    router.query.timeScale
  );

  useEffect(() => {
    setFocusDate(getDateFromString(focusDateStr));
  }, [focusDateStr]);

  useEffect(() => {
    const focusedDate = dayjs.utc(focusDate).format('YYYY-MM-DD');
    router.replace(
      {
        pathname: undefined,
        query: {
          ...(campId && { campId: campId }),
          focusDate: focusedDate,
          orgId: orgId,
          timeScale: timeScale,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [focusDate, timeScale]);

  function navigateTo(timeScale: TimeScale, date: Date) {
    setPersistentTimeScale(timeScale);
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
          setPersistentTimeScale(timeScale);
        }}
        onStepBackward={() => {
          // Steps back to the last day with an event on day view
          if (timeScale === TimeScale.DAY && prevActivityDay) {
            setFocusDate(prevActivityDay[0]);
          } else {
            setFocusDate(dayjs(focusDate).subtract(1, timeScale).toDate());
          }
        }}
        onStepForward={() => {
          // Steps forward to the next day with an event on day view
          if (timeScale === TimeScale.DAY && nextActivityDay) {
            setFocusDate(nextActivityDay[0]);
          } else {
            setFocusDate(dayjs(focusDate).add(1, timeScale).toDate());
          }
        }}
        orgId={parseInt(orgId as string)}
        timeScale={timeScale}
      />

      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        marginTop={2}
        overflow="auto"
      >
        <Suspense>
          {timeScale === TimeScale.DAY && (
            <CalendarDayView
              focusDate={focusDate}
              onClickPreviousDay={(date) => setFocusDate(date)}
              previousActivityDay={prevActivityDay}
            />
          )}
          {timeScale === TimeScale.WEEK && (
            <CalendarWeekView
              focusDate={focusDate}
              onClickDay={(date) => navigateTo(TimeScale.DAY, date)}
            />
          )}
          {timeScale === TimeScale.MONTH && (
            <CalendarMonthView
              focusDate={focusDate}
              onClickDay={(date) => navigateTo(TimeScale.DAY, date)}
              onClickWeek={(date) => navigateTo(TimeScale.WEEK, date)}
            />
          )}
        </Suspense>
      </Box>
      <SelectionBar />
    </Box>
  );
};

export default Calendar;
