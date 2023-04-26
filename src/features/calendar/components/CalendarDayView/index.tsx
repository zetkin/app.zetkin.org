import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import ZUIFuture from 'zui/ZUIFuture';

import { dateIsEqualOrBefore } from 'utils/dateUtils';
import useModel from 'core/useModel';
import CampaignActivitiesModel, {
  ACTIVITIES,
} from 'features/campaigns/models/CampaignActivitiesModel';

import CalendarDayItem from './CalendarDayItem';
import { DayInfo } from './types';

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
        // Group all by date
        const activitiesByDate: { [key: string]: DayInfo } = {};
        for (let i = 0; i < data.length; i++) {
          const activity = data[i];
          if (activity.kind == ACTIVITIES.EVENT) {
            const dateString = new Date(activity.data.start_time)
              .toISOString()
              .slice(0, 10);
            if (!(dateString in activitiesByDate)) {
              activitiesByDate[dateString] = {
                activities_ends: [],
                activities_starts: [],
                events: [],
              };
            }

            activitiesByDate[dateString].events.push(activity.data);
          } else {
            if (activity.startDate != null) {
              const dateString = new Date(activity.startDate)
                .toISOString()
                .slice(0, 10);
              if (!(dateString in activitiesByDate)) {
                activitiesByDate[dateString] = {
                  activities_ends: [],
                  activities_starts: [],
                  events: [],
                };
              }
              activitiesByDate[dateString].activities_starts.push(activity);
            }
            if (activity.endDate != null) {
              const dateString = new Date(activity.endDate)
                .toISOString()
                .slice(0, 10);
              if (!(dateString in activitiesByDate)) {
                activitiesByDate[dateString] = {
                  activities_ends: [],
                  activities_starts: [],
                  events: [],
                };
              }
              activitiesByDate[dateString].activities_ends.push(activity);
            }
          }
        }
        const todayAndFutureActivitiesDates = Object.keys(activitiesByDate)
          .filter((d) => dateIsEqualOrBefore(new Date(d), new Date(focusDate)))
          .sort();

        return (
          <Box
            sx={{
              flexDirection: 'row',
              marginTop: '1em',
            }}
          >
            {todayAndFutureActivitiesDates.map((date, index) => (
              <CalendarDayItem
                key={index}
                date={new Date(date)}
                dayInfo={activitiesByDate[date]}
                focusDate={new Date(focusDate)}
              />
            ))}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default CalendarDayView;
