import Box from '@mui/material/Box';
import useModel from 'core/useModel';
import CampaignActivitiesModel, { ACTIVITIES, CampaignActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { useRouter } from 'next/router';
import ZUIFuture from 'zui/ZUIFuture';
import CalendarDayItem from './CalendarDayItem';
import { dateIsEqualOrBefore, isSameDate } from 'utils/dateUtils';
import { ZetkinActivity, ZetkinEvent } from 'utils/types/zetkin';
import { DayInfo } from './types';

export interface CalendarDayViewProps {
  focusDate: Date;
}

const CalendarDayView = ({
  focusDate
}: CalendarDayViewProps) => {
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
            const dateString = new Date(activity.data.start_time).toISOString().slice(0, 10);
            if (!(dateString in activitiesByDate)) {
              activitiesByDate[dateString] = {
                "events": [],
                "activities_starts": [],
                "activities_ends": []
              }
            }

            activitiesByDate[dateString].events.push(activity.data);
          } else {
            if (activity.startDate != null) {
              const dateString = new Date(activity.startDate).toISOString().slice(0, 10);
              if (!(dateString in activitiesByDate)) {
                activitiesByDate[dateString] = {
                  "events": [],
                  "activities_starts": [],
                  "activities_ends": []
                }
              }
              activitiesByDate[dateString].activities_starts.push(activity);
            }
            if (activity.endDate != null) {
              const dateString = new Date(activity.endDate).toISOString().slice(0, 10);
              if (!(dateString in activitiesByDate)) {
                activitiesByDate[dateString] = {
                  "events": [],
                  "activities_starts": [],
                  "activities_ends": []
                }
              }
              activitiesByDate[dateString].activities_ends.push(activity);
            }
          }
        }
        console.log("activitiesByDate");
        console.log(activitiesByDate);
        const todayAndFutureEventsDates = Object.keys(activitiesByDate).filter(d => dateIsEqualOrBefore(new Date(d), new Date(focusDate))).sort();
        console.log("todayAndFutureEventsDates");
        console.log(todayAndFutureEventsDates);


        const events = data.filter(a => a.kind == ACTIVITIES.EVENT).map(activity => activity.data) as ZetkinEvent[];
        const laterEvents = events.filter(a => a.start_time != null && dateIsEqualOrBefore(new Date(a.start_time), new Date(focusDate)));
        const laterEventsSameDay = laterEvents.length > 0 ?
          laterEvents.filter(a => isSameDate(new Date(a.start_time), new Date(laterEvents[0].start_time))) : [];
        return (
          <Box
            sx={{
              flexDirection: 'row',
              marginTop: '1em',
            }}
          >
            {console.log("focusdate: "+focusDate.toISOString())}
            {console.log("laterEvents length: "+laterEvents.length)}
            {console.log("laterEvents[0].data.start_time: "+String((laterEvents.length > 0 ? laterEvents[0].start_time: "-")))}
            {console.log("laterEvents[1].data.start_time: "+String((laterEvents.length > 1 ? laterEvents[1].start_time: "-")))}


            {console.log("laterEventsSameDay.length: "+laterEventsSameDay.length)}
            {console.log("laterEventsSameDay[0].data.start_time: "+String((laterEventsSameDay.length > 0 ? laterEventsSameDay[0].start_time: "-")))}
            {console.log("laterEventsSameDay[1].data.start_time: "+String((laterEventsSameDay.length > 1 ? laterEventsSameDay[1].start_time: "-")))}

            
            {/* { laterEventsSameDay.length > 0 && 
              <CalendarDayItem focusDate={new Date(focusDate)} date={new Date(laterEventsSameDay[0].start_time)} events={laterEventsSameDay} />
            } */}
            { todayAndFutureEventsDates.length > 0 && 
              <CalendarDayItem focusDate={new Date(focusDate)} date={new Date(todayAndFutureEventsDates[0])} dayInfo={activitiesByDate[todayAndFutureEventsDates[0]]} />
            }
            {/* { laterEvents.length > 1 && 
              <CalendarDayItem focusDate={new Date(focusDate)} date={new Date(laterEvents[1].data.start_time)} />
            } */}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default CalendarDayView;
