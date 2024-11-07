import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { FC, useState } from 'react';

import { Household, ZetkinPlace } from 'features/canvassAssignments/types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import PageBase from './PageBase';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';

type PlaceProps = {
  onClose: () => void;
  onCreateHousehold: (householdId: Household) => void;
  onEdit: () => void;
  onSelectHousehold: (householdId: string) => void;
  orgId: number;
  place: ZetkinPlace;
};

const Place: FC<PlaceProps> = ({
  onClose,
  onEdit,
  onCreateHousehold,
  onSelectHousehold,
  orgId,
  place,
}) => {
  const [adding, setAdding] = useState(false);
  const { addHousehold } = usePlaceMutations(orgId, place.id);

  return (
    <PageBase
      onClose={onClose}
      onEdit={onEdit}
      title={place.title || 'Untitled place'}
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
          alignItems="center"
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
          <Box mt={2}>
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
          </Box>
        </Box>
      </Box>
    </PageBase>
  );
};

export default Place;
