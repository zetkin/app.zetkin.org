import { range } from 'lodash';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';

import PageBase from './PageBase';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import messageIds from 'features/canvass/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import FloorMatrix from '../FloorMatrix';
import { EditedFloor } from '../FloorMatrix/types';
import useLocationMutations from 'features/canvass/hooks/useLocationMutations';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onBack: () => void;
  onBulkEdit: (householdIds: number[]) => void;
  onBulkVisit: (households: number[]) => void;
  onClickVisit: (householdId: number) => void;
  onClose: () => void;
  onSelectHousehold: (householdId: number) => void;
};

const HouseholdsPage2: FC<Props> = ({
  assignment,
  onBack,
  onBulkEdit,
  onBulkVisit,
  onClickVisit,
  onClose,
  onSelectHousehold,
  location,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const { addHouseholds } = useLocationMutations(
    location.organization_id,
    location.id
  );
  const [draftFloors, setDraftFloors] = useState<null | EditedFloor[]>(null);
  const [selectedHouseholdIds, setSelectedHouseholdIds] = useState<
    null | number[]
  >(null);

  const mode = draftFloors
    ? 'edit'
    : selectedHouseholdIds
    ? 'select'
    : 'browse';

  const numDraftHouseholds =
    draftFloors?.reduce((sum, floor) => sum + floor.draftHouseholdCount, 0) ??
    0;

  return (
    <PageBase
      onBack={onBack}
      onClose={onClose}
      subtitle={location.title}
      title={messages.households.page.header()}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        {location.num_known_households == 0 && (
          <Typography color="secondary" sx={{ fontStyle: 'italic' }}>
            <Msg id={messageIds.households.page.empty} />
          </Typography>
        )}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            gap: 1,
            p: 2,
            position: 'sticky',
            top: -8,
            zIndex: 2,
          }}
        >
          <ToggleButtonGroup
            exclusive
            fullWidth
            onChange={(_, value) => {
              if (value == 'edit') {
                setDraftFloors([]);
              } else if (value == 'select') {
                setSelectedHouseholdIds([]);
              } else {
                setDraftFloors(null);
                setSelectedHouseholdIds(null);
              }
            }}
            value={mode}
          >
            <ToggleButton value="browse">Browse</ToggleButton>
            <ToggleButton value="select">Select</ToggleButton>
            <ToggleButton value="edit">Edit</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box
          sx={{
            marginTop: 'auto',
          }}
        >
          <FloorMatrix
            assignment={assignment}
            draftFloors={draftFloors}
            location={location}
            onClickVisit={onClickVisit}
            onEditChange={(drafts) => {
              setDraftFloors(drafts);
            }}
            onSelectHousehold={onSelectHousehold}
            onUpdateSelection={(selectedIds) =>
              setSelectedHouseholdIds(selectedIds)
            }
            selectedHouseholdIds={selectedHouseholdIds}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            bottom: 0,
            display: 'flex',
            gap: 1,
            p: 2,
            position: 'sticky',
          }}
        >
          {!!draftFloors && (
            <>
              <Typography>{numDraftHouseholds} new households</Typography>
              <Button onClick={() => setDraftFloors(null)}>Cancel</Button>
              <Button
                onClick={async () => {
                  const newHouseholds = draftFloors.flatMap((draft) => {
                    const firstNewIndex = draft.existingHouseholds.length;
                    const lastNewIndex =
                      firstNewIndex + draft.draftHouseholdCount;
                    return range(firstNewIndex, lastNewIndex).map((index) => ({
                      level: draft.level,
                      title: 'Household ' + (index + 1),
                    }));
                  });

                  await addHouseholds(newHouseholds);
                  setDraftFloors(null);
                }}
              >
                Save
              </Button>
            </>
          )}
          {!!selectedHouseholdIds?.length && (
            <Button
              onClick={() =>
                !!selectedHouseholdIds && onBulkEdit(selectedHouseholdIds)
              }
              variant="outlined"
            >
              Edit
            </Button>
          )}
          {!!selectedHouseholdIds?.length && (
            <Button
              onClick={() =>
                !!selectedHouseholdIds && onBulkVisit(selectedHouseholdIds)
              }
              variant="outlined"
            >
              Visit
            </Button>
          )}
        </Box>
      </Box>
    </PageBase>
  );
};

export default HouseholdsPage2;
