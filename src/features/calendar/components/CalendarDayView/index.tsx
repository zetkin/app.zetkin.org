import Box from '@mui/material/Box';
import { CampaignActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import dayjs from 'dayjs';

import Day from './Day';
import PreviousDayPrompt from './PreviousDayPrompt';
import { getActivitiesByDate, getPreviousDay } from './utils';

export interface CalendarDayViewProps {
  activities: CampaignActivity[];
  focusDate: Date;
  onClickPreviousDay: (date: Date) => void;
}

const CalendarDayView = ({
  activities,
  focusDate,
  onClickPreviousDay,
}: CalendarDayViewProps) => {
  const activitiesByDate = getActivitiesByDate(activities);
  const futureDays = Object.entries(activitiesByDate).filter(([dateString]) => {
    const activityDay = dayjs(dateString);
    return (
      activityDay.isSame(focusDate, 'day') || activityDay.isAfter(focusDate)
    );
  });
  const previousActivityDay = getPreviousDay(activitiesByDate, focusDate);

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
      {futureDays.map(([dateString, daySummary], index) => {
        return (
          <Day key={index} date={new Date(dateString)} dayInfo={daySummary} />
        );
      })}
    </Box>
  );
};

export default CalendarDayView;
