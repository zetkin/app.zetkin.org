import Box from '@mui/material/Box';
import { DayInfo } from './types';

export interface CalendarDayOtherActivitiesProps {
  dayInfo: DayInfo;
}

const CalendarDayOtherActivities = ({
  dayInfo,
}: CalendarDayOtherActivitiesProps) => {
  let infoTexts = [];
  if (dayInfo.activities_starts.length > 0) {
    infoTexts.push(`${dayInfo.activities_starts.length} activities starts`);
  }
  if (dayInfo.activities_ends.length > 0) {
    infoTexts.push(`${dayInfo.activities_ends.length} activities ends`);
  }
  const allInfoText = infoTexts.join(', ');

  return (
    <Box
      display="flex"
      sx={{
        margin: '0.5em',
        padding: '0.5em',
      }}
    >
      {allInfoText}
    </Box>
  );
};

export default CalendarDayOtherActivities;
