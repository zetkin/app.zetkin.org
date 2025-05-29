import Box from '@mui/material/Box';
import { Button, CircularProgress } from '@mui/material';
import { useMemo, useState } from 'react';

import Day from './Day';
import { DaySummary, setEquals } from '../utils';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import PreviousDayPrompt from './PreviousDayPrompt';
import useDayCalendarEvents from 'features/calendar/hooks/useDayCalendarEvents';
import { setEventIdsVisibleInUI } from 'features/events/store';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { RootState } from 'core/store';

export interface CalendarDayViewProps {
  onClickPreviousDay: (date: Date) => void;
  previousActivityDay: [Date, DaySummary] | null;
}

const CalendarDayView = ({
  onClickPreviousDay,
  previousActivityDay,
}: CalendarDayViewProps) => {
  const focusDate = useAppSelector(
    (state: RootState) => state.calendar.focusDate
  );
  const { activities, hasMore, isLoadingFuture, loadMoreFuture } =
    useDayCalendarEvents(focusDate);
  const dispatch = useAppDispatch();

  const [visibleEvents, setVisibleEvents] = useState<Set<number>>(new Set());

  useMemo(() => {
    const eventIds = activities
      .flatMap((c) => c[1])
      .flatMap((c) => c.events)
      .map((e) => e.data.id);
    const newVisibleEvents = new Set(eventIds);
    if (!setEquals(newVisibleEvents, visibleEvents)) {
      setVisibleEvents(newVisibleEvents);
      dispatch(setEventIdsVisibleInUI([...newVisibleEvents]));
    }
  }, [activities]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {previousActivityDay && (
        <PreviousDayPrompt
          date={previousActivityDay[0]}
          daySummary={previousActivityDay[1]}
          onClickShowMore={() => {
            onClickPreviousDay(previousActivityDay[0]);
          }}
        />
      )}
      {/* List of days with events */}
      {activities.map(([dateString, daySummary], index) => {
        return (
          <Day
            key={`dayIdx-${index}`}
            date={new Date(dateString)}
            dayInfo={daySummary}
          />
        );
      })}
      <Box display="flex" justifyContent={'center'} pb={10}>
        {isLoadingFuture && <CircularProgress />}
        {!isLoadingFuture && hasMore && (
          <Button onClick={() => loadMoreFuture()}>
            <Msg id={messageIds.loadMore} />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CalendarDayView;
