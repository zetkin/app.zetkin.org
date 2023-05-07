import Box from '@mui/material/Box';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import Day from './Day';
import { getActivitiesByDate } from './utils';
import PreviousDayPrompt from './PreviousDayPrompt';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';

export interface CalendarDayViewProps {
  focusDate: Date;
}

const CalendarDayView = ({ focusDate }: CalendarDayViewProps) => {
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

        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <PreviousDayPrompt
              onClickShowMore={() => {
                return;
              }}
            />
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
