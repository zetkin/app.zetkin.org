import Box from '@mui/material/Box';
import useModel from 'core/useModel';
import CampaignActivitiesModel, {
  ACTIVITIES,
  CampaignActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';
import { useRouter } from 'next/router';
import ZUIFuture from 'zui/ZUIFuture';
import CalendarDayItem from './CalendarDayItem';
import { dateIsEqualOrBefore, isSameDate } from 'utils/dateUtils';
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
                events: [],
                activities_starts: [],
                activities_ends: [],
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
                  events: [],
                  activities_starts: [],
                  activities_ends: [],
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
                  events: [],
                  activities_starts: [],
                  activities_ends: [],
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
            {todayAndFutureActivitiesDates.map((d, i) => (
              <CalendarDayItem
                focusDate={new Date(focusDate)}
                date={new Date(d)}
                dayInfo={activitiesByDate[d]}
              />
            ))}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default CalendarDayView;
