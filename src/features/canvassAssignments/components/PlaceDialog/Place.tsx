import { Box, Divider, Typography } from '@mui/material';
import { FC } from 'react';

import { ZetkinPlace } from 'features/canvassAssignments/types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

type PlaceProps = {
  onSelectHousehold: (householdId: string) => void;
  place: ZetkinPlace;
};

const Place: FC<PlaceProps> = ({ onSelectHousehold, place }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      height="100%"
      justifyContent="space-between"
      paddingTop={1}
    >
      <Typography variant="h6">Description</Typography>
      <Divider />
      <Typography color="secondary">
        {place.description || 'Empty description'}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={2}
        gap={1}
        overflow="hidden"
      >
        <Typography variant="h6">
          {`${place.households.length} household/s`}
        </Typography>
        <Divider />
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ overflowY: 'auto' }}
        >
          {place.households.map((household) => {
            const sortedVisits = household.visits.toSorted((a, b) => {
              const dateA = new Date(a.timestamp);
              const dateB = new Date(b.timestamp);
              if (dateA > dateB) {
                return -1;
              } else if (dateB > dateA) {
                return 1;
              } else {
                return 0;
              }
            });

            const mostRecentVisit =
              sortedVisits.length > 0 ? sortedVisits[0] : null;

            return (
              <Box
                key={household.id}
                alignItems="center"
                display="flex"
                onClick={() => {
                  onSelectHousehold(household.id);
                }}
                width="100%"
              >
                <Box flexGrow={1}>
                  {household.title || 'Untitled household'}
                </Box>
                {mostRecentVisit && (
                  <ZUIRelativeTime datetime={mostRecentVisit.timestamp} />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Place;
