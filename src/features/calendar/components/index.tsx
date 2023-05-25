import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useState } from 'react';

import CalendarDayView from './CalendarDayView';
import CalendarMonthView from './CalendarMonthView';
import CalendarNavBar from './CalendarNavBar';
import CalendarWeekView from './CalendarWeekView';
import useDayCalendarNav from '../hooks/useDayCalendarNav';

import utc from 'dayjs/plugin/utc';
import { Button, ButtonGroup, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'core/store';
import { CheckBoxOutlined } from '@mui/icons-material';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
dayjs.extend(utc);

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
    const focusedDate = dayjs(focusDate).format('YYYY-MM-DD');
    router.push(
      {
        pathname: undefined,
        query: {
          campId: campId,
          focusDate: focusedDate,
          orgId: orgId,
          timeScale: selectedTimeScale,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [focusDate, selectedTimeScale]);

  function navigateTo(timeScale: TimeScale, date: Date) {
    setSelectedTimeScale(timeScale);
    setFocusDate(date);
  }

  const selectedEvents = useSelector(
    (state: RootState) => state.events.selectedEvents
  );

  return (
    <>
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
            // Steps back to the last day with an event on day view
            if (selectedTimeScale === TimeScale.DAY && prevActivityDay) {
              setFocusDate(prevActivityDay[0]);
            } else {
              setFocusDate(
                dayjs(focusDate).subtract(1, selectedTimeScale).toDate()
              );
            }
          }}
          onStepForward={() => {
            // Steps forward to the next day with an event on day view
            if (selectedTimeScale === TimeScale.DAY && nextActivityDay) {
              setFocusDate(nextActivityDay[0]);
            } else {
              setFocusDate(dayjs(focusDate).add(1, selectedTimeScale).toDate());
            }
          }}
          orgId={parseInt(orgId as string)}
          timeScale={selectedTimeScale}
        />

        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          marginTop={2}
          overflow="auto"
        >
          <Suspense>
            {selectedTimeScale === TimeScale.DAY && (
              <CalendarDayView
                focusDate={focusDate}
                onClickPreviousDay={(date) => setFocusDate(date)}
                previousActivityDay={prevActivityDay}
              />
            )}
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
          </Suspense>
        </Box>
      </Box>
      {selectedEvents.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            backgroundColor: 'white',
            width: '100%',
            position: 'sticky',
            bottom: 15,
          }}
        >
          <Box display="flex" alignItems="center">
            <CheckBoxOutlined color="primary" />
            <Typography color="primary" sx={{ px: 0.4 }}>
              {selectedEvents.length}
            </Typography>
            <ButtonGroup variant="text" color="secondary">
              <Button color="primary" sx={{ mr: 1 }}>
                <Msg id={messageIds.deselect} />
              </Button>
              <Button
                variant="outlined"
                color="primary"
                sx={{ ml: 1, borderRadius: '5px' }}
              >
                <Msg id={messageIds.editEvents} />
              </Button>
            </ButtonGroup>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Calendar;
