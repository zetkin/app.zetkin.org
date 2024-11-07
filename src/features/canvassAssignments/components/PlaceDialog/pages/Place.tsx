import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { FC, useState } from 'react';

import { Household, ZetkinPlace } from 'features/canvassAssignments/types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import PageBase from './PageBase';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';
import { PlaceDialogStep } from '../../CanvassAssignmentMapOverlays';

type PlaceProps = {
  onClose: () => void;
  onCreateHousehold: (householdId: Household) => void;
  onEdit: () => void;
  onNavigate: (step: PlaceDialogStep) => void;
  onSelectHousehold: (householdId: string) => void;
  orgId: number;
  place: ZetkinPlace;
};

const Place: FC<PlaceProps> = ({
  onClose,
  onEdit,
  onCreateHousehold,
  onNavigate,
  onSelectHousehold,
  orgId,
  place,
}) => {
  const { addHousehold } = usePlaceMutations(orgId, place.id);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <PageBase
      actions={
        <>
          {place.households.length == 0 && (
            <Button
              fullWidth
              onClick={async () => {
                const newlyAddedHousehold = await addHousehold();
                onCreateHousehold(newlyAddedHousehold);
              }}
              variant="contained"
            >
              Add household
            </Button>
          )}
          {place.households.length == 1 && (
            <ButtonGroup variant="contained">
              <Button
                fullWidth
                onClick={() => {
                  onSelectHousehold(place.households[0].id);
                  onNavigate('wizard');
                }}
              >
                Log visit
              </Button>
              <Button
                onClick={(ev) => setAnchorEl(ev.currentTarget)}
                size="small"
              >
                <MoreVert />
              </Button>
            </ButtonGroup>
          )}
          {place.households.length > 1 && (
            <ButtonGroup variant="contained">
              <Button
                fullWidth
                onClick={() => {
                  onNavigate('pickHousehold');
                }}
              >
                Log visit
              </Button>
              <Button
                onClick={(ev) => setAnchorEl(ev.currentTarget)}
                size="small"
              >
                <MoreVert />
              </Button>
            </ButtonGroup>
          )}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              horizontal: 'left',
              vertical: 'top',
            }}
            onClose={() => setAnchorEl(null)}
            open={!!anchorEl}
            sx={{
              zIndex: 99999,
            }}
            transformOrigin={{
              horizontal: 'center',
              vertical: 'bottom',
            }}
          >
            <MenuItem
              onClick={async () => {
                const newlyAddedHousehold = await addHousehold();
                onCreateHousehold(newlyAddedHousehold);
                setAnchorEl(null);
              }}
            >
              Add household
            </MenuItem>
          </Menu>
        </>
      }
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
    </PageBase>
  );
};

export default Place;
