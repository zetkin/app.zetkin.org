import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';

import {
  ZetkinCanvassAssignment,
  ZetkinPlace,
} from 'features/canvassAssignments/types';
import PageBase from './PageBase';

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
  const numVisitedHouseholds =
    place?.households.filter((household) =>
      household.visits.some((visit) => visit.canvassAssId == assignment.id)
    ).length ?? 0;

  return (
    <PageBase
      onClose={onClose}
      onEdit={onEdit}
      subtitle={`${numVisitedHouseholds} / ${place.households.length} households visited`}
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
    </PageBase>
  );
};

export default Place;
