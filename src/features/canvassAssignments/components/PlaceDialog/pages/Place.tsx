import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { Add, KeyboardArrowRight } from '@mui/icons-material';
import { FC, useState } from 'react';

import {
  Household,
  ZetkinCanvassAssignment,
  ZetkinPlace,
} from 'features/canvassAssignments/types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import PageBase from './PageBase';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';

type PlaceProps = {
  assignment: ZetkinCanvassAssignment;
  onBulk: () => void;
  onClose: () => void;
  onCreateHousehold: (householdId: Household) => void;
  onEdit: () => void;
  onSelectHousehold: (householdId: string) => void;
  orgId: number;
  place: ZetkinPlace;
};

const Place: FC<PlaceProps> = ({
  assignment,
  onBulk,
  onClose,
  onEdit,
  onCreateHousehold,
  onSelectHousehold,
  orgId,
  place,
}) => {
  const [adding, setAdding] = useState(false);
  const { addHousehold } = usePlaceMutations(orgId, place.id);

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
          sx={{ fontStyle: place.description ? 'normal' : 'italic' }}
        >
          {place.description || 'Empty description'}
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={2}
        gap={1}
        mt={4}
        overflow="hidden"
      >
        <Typography onClick={onEdit} variant="h6">
          Households
        </Typography>
        {place.households.length == 0 && (
          <Typography color="secondary" sx={{ fontStyle: 'italic' }}>
            This place does not contain data about any households yet.
          </Typography>
        )}
        <Box
          alignItems="stretch"
          display="flex"
          flexDirection="column"
          gap={2}
          mt={1}
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
              <Box key={household.id}>
                <Box
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
                    <Typography color="secondary">
                      <ZUIRelativeTime datetime={mostRecentVisit.timestamp} />
                    </Typography>
                  )}
                  <KeyboardArrowRight />
                </Box>
                <Divider />
              </Box>
            );
          })}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              disabled={adding}
              onClick={async () => {
                setAdding(true);
                const newlyAddedHousehold = await addHousehold();
                setAdding(false);
                onCreateHousehold(newlyAddedHousehold);
              }}
              startIcon={
                adding ? (
                  <CircularProgress color="secondary" size="20px" />
                ) : (
                  <Add />
                )
              }
              variant="outlined"
            >
              Add household
            </Button>
            <Button onClick={onBulk} variant="outlined">
              Create many households
            </Button>
          </Box>
        </Box>
      </Box>
    </PageBase>
  );
};

export default Place;
