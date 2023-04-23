import Box from '@mui/material/Box';
import { DayInfo } from './types';

export interface CalendarDayOtherActivitiesProps {
  dayInfo: DayInfo;
}

const CalendarDayOtherActivities = ({ dayInfo }: CalendarDayOtherActivitiesProps) => {
  return <Box display="flex"
    sx={{
      margin: "0.5em",
      padding: "0.5em",
    }}
  >
    { dayInfo.activities_starts.length > 0 &&
      <div>{dayInfo.activities_starts.length} activity starts</div>
    },
    { dayInfo.activities_ends.length > 0 &&
      <div>{dayInfo.activities_ends.length} activity ends</div>
    }
    
  </Box>
};

export default CalendarDayOtherActivities;