import Box from '@mui/material/Box';
import { useRouter } from 'next/router';

import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import ZUIFuture from 'zui/ZUIFuture';

import Day from './Day';
import { getActivitiesByDate } from './utils';
import PreviousDayPrompt from './PreviousDayPrompt';
import useModel from 'core/useModel';
// import dayjs from 'dayjs';

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
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <PreviousDayPrompt
              onClickShowMore={() => {
                return;
              }}
            />
            {/* List of days with events */}
            {Object.entries(activitiesByDate).map(
              ([dateString, daySummary], index) => {
                return (
                  <Day
                    key={index}
                    date={new Date(dateString)}
                    dayInfo={daySummary}
                  />
                );
              }
            )}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default CalendarDayView;
