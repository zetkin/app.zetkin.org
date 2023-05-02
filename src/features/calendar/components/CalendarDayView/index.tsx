import Box from '@mui/material/Box';

import { CampaignActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { dateIsEqualOrBefore } from 'utils/dateUtils';
import Day from './Day';
import groupActivitiesByDate from './utils';
import PreviousDayPrompt from './PreviousDayPrompt';

export interface CalendarDayViewProps {
  activities: CampaignActivity[];
  focusDate: Date;
}

const CalendarDayView = ({ activities, focusDate }: CalendarDayViewProps) => {
  const activitiesByDate = groupActivitiesByDate(activities);
  const todayAndFutureActivitiesDates = Object.keys(activitiesByDate)
    .filter((d) => dateIsEqualOrBefore(new Date(d), new Date(focusDate)))
    .sort();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <PreviousDayPrompt
        onClickShowMore={() => {
          return;
        }}
      />
      {/* List of days with events */}
      {todayAndFutureActivitiesDates.map((date, index) => {
        const daysEvents = activitiesByDate[date];
        return <Day key={index} date={new Date(date)} dayInfo={daysEvents} />;
      })}
    </Box>
  );
};

export default CalendarDayView;
