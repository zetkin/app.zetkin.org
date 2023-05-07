import Box from '@mui/material/Box';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import Day from './Day';
import PreviousDayPrompt from './PreviousDayPrompt';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';
import { getActivitiesByDate, getPreviousDay } from './utils';

export interface CalendarDayViewProps {
  focusDate: Date;
  onClickPreviousDay: (date: Date) => void;
}

const CalendarDayView = ({
  focusDate,
  onClickPreviousDay,
}: CalendarDayViewProps) => {
  const { orgId } = useRouter().query;
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId as string))
  );
  return (
    <ZUIFuture future={model.getAllActivities()}>
      {(data) => {
        const activitiesByDate = getActivitiesByDate(data);
        const futureDays = Object.entries(activitiesByDate).filter(
          ([dateString]) => {
            const activityDay = dayjs(dateString);
            return (
              activityDay.isSame(focusDate, 'day') ||
              activityDay.isAfter(focusDate)
            );
          }
        );
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
                <Day
                  key={index}
                  date={new Date(dateString)}
                  dayInfo={daySummary}
                />
              );
            })}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default CalendarDayView;
