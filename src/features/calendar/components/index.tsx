import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { Suspense, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { TimeScale } from '../types';
import CalendarDayView from './CalendarDayView';
import CalendarMonthView from './CalendarMonthView';
import CalendarNavBar from './CalendarNavBar';
import CalendarWeekView from './CalendarWeekView';
import SelectionBar from '../../events/components/SelectionBar';
import useDayCalendarNav from '../hooks/useDayCalendarNav';
import useTimeScale from '../hooks/useTimeScale';
import { useFocusDate } from 'utils/hooks/useFocusDate';

dayjs.extend(utc);
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

  const { setTimeScale, timeScale } = useTimeScale(router.query.timeScale);
  const { focusDate, setFocusDate } = useFocusDate();
  const focusDateStr = router.query.focusDate as string;
  const { nextActivityDay, prevActivityDay } = useDayCalendarNav(focusDate);

  useEffect(() => {
    setFocusDate(getDateFromString(focusDateStr));
  }, []);

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
    setTimeScale(timeScale);
    setFocusDate(date);
  }

  return (
    <Box display="flex" flexDirection="column" height={'100%'} padding={2}>
      <CalendarNavBar
        onChangeFocusDate={(date) => {
          setFocusDate(date);
        }}
        onChangeTimeScale={(timeScale) => {
          setTimeScale(timeScale);
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
              onClickPreviousDay={(date) => setFocusDate(date)}
              previousActivityDay={prevActivityDay}
            />
          )}
          {timeScale === TimeScale.WEEK && (
            <CalendarWeekView
              onClickDay={(date) => navigateTo(TimeScale.DAY, date)}
            />
          )}
          {timeScale === TimeScale.MONTH && (
            <CalendarMonthView
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
