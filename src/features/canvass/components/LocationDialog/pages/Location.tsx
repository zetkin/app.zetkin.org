import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { FC } from 'react';

import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import PageBase from './PageBase';
import uselocationVisits from 'features/canvass/hooks/useLocationVisits';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import estimateVisitedHouseholds from 'features/canvass/utils/estimateVisitedHouseholds';

type LocationProps = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onClose: () => void;
  onEdit: () => void;
  onHouseholds: () => void;
  onVisit: () => void;
};

const Location: FC<LocationProps> = ({
  assignment,
  onClose,
  onEdit,
  onHouseholds,
  onVisit,
  location,
}) => {
  const visitsFuture = uselocationVisits(
    assignment.organization.id,
    assignment.id,
    location.id
  );

  const numHouseholdsVisitedIndividually =
    location?.households.filter((household) =>
      household.visits.some((visit) => visit.areaAssId == assignment.id)
    ).length ?? 0;

  const numHouseholdsPerLocationVisit =
    visitsFuture.data?.map(estimateVisitedHouseholds) ?? [];

  const numVisitedHouseholds = Math.max(
    numHouseholdsVisitedIndividually,
    ...numHouseholdsPerLocationVisit
  );

  const numHouseholds = Math.max(
    location.households.length,
    numVisitedHouseholds
  );

  return (
    <PageBase
      onClose={onClose}
      onEdit={onEdit}
      title={location.title || 'Untitled place'}
    >
      <Box>
        <Typography
          color="secondary"
          onClick={onEdit}
          sx={{ fontStyle: location.description ? 'normal' : 'italic' }}
        >
          {location.description || 'Empty description'}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex" flexDirection="column" my={3}>
        {!!numHouseholds && (
          <>
            <Typography variant="h4">
              {`${numVisitedHouseholds} of ${numHouseholds}`}
            </Typography>
            <Typography variant="body2">households visited</Typography>
          </>
        )}
        {!numHouseholds && (
          <Typography variant="body2">
            No households registered here yet
          </Typography>
        )}
      </Box>
      <Box display="flex" gap={1} justifyContent="center" m={4}>
        {assignment.reporting_level == 'location' && (
          <Button onClick={onVisit} variant="contained">
            Quick-report
          </Button>
        )}
        <Button onClick={onHouseholds} variant="contained">
          Households
        </Button>
      </Box>
      <Box my={2}>
        <Divider />
      </Box>
      <Box>
        <ZUIFuture future={visitsFuture}>
          {(visits) => (
            <>
              <Typography>History</Typography>
              <List>
                {visits.map((visit) => {
                  const households = estimateVisitedHouseholds(visit);
                  return (
                    <ListItem key={visit.id}>
                      <Box
                        display="flex"
                        gap={1}
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Typography>{households} households</Typography>
                        <ZUIRelativeTime datetime={visit.timestamp} />
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </>
          )}
        </ZUIFuture>
      </Box>
    </PageBase>
  );
};

export default Location;
