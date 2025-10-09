import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';

import { EditedFloor } from './FloorMatrix/types';

type Props = {
  draftFloors: EditedFloor[] | null;
  onBulkEdit: (householdIds: number[]) => void;
  onBulkVisit: (householdIds: number[]) => void;
  onEditCancelled: () => void;
  onEditSave: () => Promise<void>;
  onEditStart: () => void;
  onSelectAll: () => void;
  onSelectCancelled: () => void;
  onSelectNone: () => void;
  onSelectStart: () => void;
  selectedHouseholdIds: number[] | null;
};

const FloorMatrixToolbar: FC<Props> = ({
  draftFloors,
  onBulkEdit,
  onBulkVisit,
  onEditCancelled,
  onEditSave,
  onEditStart,
  onSelectAll,
  onSelectCancelled,
  onSelectNone,
  onSelectStart,
  selectedHouseholdIds,
}) => {
  const theme = useTheme();
  const [saving, setSaving] = useState(false);

  const numDraftHouseholds =
    draftFloors?.reduce((sum, floor) => sum + floor.draftHouseholdCount, 0) ??
    0;

  const mode = draftFloors
    ? 'edit'
    : selectedHouseholdIds
    ? 'select'
    : 'browse';

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
        position: 'sticky',
        pt: mode == 'select' ? 1 : 2,
      }}
    >
      {mode == 'select' && (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            disabled={!selectedHouseholdIds?.length}
            fullWidth
            onClick={() =>
              !!selectedHouseholdIds && onBulkEdit(selectedHouseholdIds)
            }
            variant="contained"
          >
            Edit
          </Button>
          <Button
            disabled={!selectedHouseholdIds?.length}
            fullWidth
            onClick={() =>
              !!selectedHouseholdIds && onBulkVisit(selectedHouseholdIds)
            }
            variant="contained"
          >
            Visit
          </Button>
        </Box>
      )}
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1,
        }}
      >
        {mode == 'browse' && (
          <>
            <Button fullWidth onClick={() => onEditStart()} variant="outlined">
              Edit Floorplan
            </Button>
            <Button
              fullWidth
              onClick={() => onSelectStart()}
              variant="outlined"
            >
              Select multiple
            </Button>
          </>
        )}
        {mode == 'edit' && (
          <>
            <Box sx={{ mr: 'auto' }}>
              <Typography variant="body2">
                Adds {numDraftHouseholds} households
              </Typography>
            </Box>
            <Button onClick={() => onEditCancelled()} variant="outlined">
              Cancel
            </Button>
            <Button
              loading={saving}
              onClick={async () => {
                setSaving(true);
                await onEditSave();
                setSaving(false);
              }}
              variant="contained"
            >
              Save
            </Button>
          </>
        )}
        {mode == 'select' && (
          <>
            <Chip
              color="primary"
              label={selectedHouseholdIds?.length ?? 0}
              size="small"
              variant="filled"
            />
            <ButtonGroup>
              <Button onClick={() => onSelectAll()}>All</Button>
              <Button onClick={() => onSelectNone()}>None</Button>
            </ButtonGroup>
            <Button
              onClick={() => onSelectCancelled()}
              sx={{ ml: 'auto' }}
              variant="outlined"
            >
              Cancel
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default FloorMatrixToolbar;
