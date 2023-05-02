import Box from '@mui/material/Box';
import { useRouter } from 'next/router';

import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import { dateIsEqualOrBefore } from 'utils/dateUtils';
import Day from './Day';
import groupActivitiesByDate from './utils';
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
        const activitiesByDate = groupActivitiesByDate(data);
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
              return (
                <Day key={index} date={new Date(date)} dayInfo={daysEvents} />
              );
            })}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default CalendarDayView;
