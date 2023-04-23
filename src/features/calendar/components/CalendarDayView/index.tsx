import Box from '@mui/material/Box';
import useModel from 'core/useModel';
import CampaignActivitiesModel, { ACTIVITIES } from 'features/campaigns/models/CampaignActivitiesModel';
import { useRouter } from 'next/router';
import ZUIFuture from 'zui/ZUIFuture';
import CalendarDayItem from './CalendarDayItem';
import { dateIsEqualOrBefore, isSameDate } from 'utils/dateUtils';
import { ZetkinEvent } from 'utils/types/zetkin';

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

            
            { laterEventsSameDay.length > 0 && 
              <CalendarDayItem focusDate={new Date(focusDate)} date={new Date(laterEventsSameDay[0].start_time)} events={laterEventsSameDay} />
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
