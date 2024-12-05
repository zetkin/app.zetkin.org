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
  ZetkinCanvassAssignment,
  ZetkinPlace,
} from 'features/canvassAssignments/types';
import PageBase from './PageBase';
import usePlaceVisits from 'features/canvassAssignments/hooks/usePlaceVisits';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import estimateVisitedHouseholds from 'features/canvassAssignments/utils/estimateVisitedHouseholds';

type PlaceProps = {
  assignment: ZetkinCanvassAssignment;
  onClose: () => void;
  onEdit: () => void;
  onHouseholds: () => void;
  onVisit: () => void;
  place: ZetkinPlace;
};

const Place: FC<PlaceProps> = ({
  assignment,
  onClose,
  onEdit,
  onHouseholds,
  onVisit,
  place,
}) => {
  const visitsFuture = usePlaceVisits(
    assignment.organization.id,
    assignment.id,
    place.id
  );

  const numHouseholdsVisitedIndividually =
    place?.households.filter((household) =>
      household.visits.some((visit) => visit.canvassAssId == assignment.id)
    ).length ?? 0;

  const numHouseholdsPerPlaceVisit =
    visitsFuture.data?.map(estimateVisitedHouseholds) ?? [];

  const numVisitedHouseholds = Math.max(
    numHouseholdsVisitedIndividually,
    ...numHouseholdsPerPlaceVisit
  );

  const numHouseholds = Math.max(place.households.length, numVisitedHouseholds);

  return (
    <PageBase
      onClose={onClose}
      onEdit={onEdit}
      title={place.title || 'Untitled place'}
    >
      <Box>
        <Typography
          color="secondary"
          onClick={onEdit}
          sx={{ fontStyle: place.description ? 'normal' : 'italic' }}
        >
          {place.description || 'Empty description'}
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
        {assignment.reporting_level == 'place' && (
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
                  const householdsPerMetric = visit.responses.map((response) =>
                    response.responseCounts.reduce((sum, value) => sum + value)
                  );
                  const households = Math.max(...householdsPerMetric);
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

export default Place;
