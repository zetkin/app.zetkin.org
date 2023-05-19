import Box from '@mui/material/Box';
import { Button, CircularProgress } from '@mui/material';

import Day from './Day';
import { DaySummary } from '../utils';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import PreviousDayPrompt from './PreviousDayPrompt';
import useDayCalendarEvents from 'features/calendar/hooks/useDayCalendarEvents';

export interface CalendarDayViewProps {
  focusDate: Date;
  onClickPreviousDay: (date: Date) => void;
  previousActivityDay: [Date, DaySummary] | null;
}

const CalendarDayView = ({
  focusDate,
  onClickPreviousDay,
  previousActivityDay,
}: CalendarDayViewProps) => {
  const { activities, hasMore, isLoadingFuture, loadMoreFuture } =
    useDayCalendarEvents(focusDate);

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
