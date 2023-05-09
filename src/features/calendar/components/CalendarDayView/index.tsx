import Box from '@mui/material/Box';

import Day from './Day';
import { DaySummary } from '../utils';
import PreviousDayPrompt from './PreviousDayPrompt';

export interface CalendarDayViewProps {
  activities: [string, DaySummary][];
  previousActivityDay: [Date, DaySummary] | null;
  focusDate: Date;
  onClickPreviousDay: (date: Date) => void;
}

const CalendarDayView = ({
  activities,
  previousActivityDay,
  onClickPreviousDay,
}: CalendarDayViewProps) => {
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
          <Day key={index} date={new Date(dateString)} dayInfo={daySummary} />
        );
      })}
    </Box>
  );
};

export default CalendarDayView;
