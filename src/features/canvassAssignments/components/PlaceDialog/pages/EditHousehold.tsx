import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { Household } from 'features/canvassAssignments/types';

type Props = {
  household: Household;
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string, floor: number | null) => void;
};

const EditHousehold: FC<Props> = ({ onClose, onBack, onSave, household }) => {
  const [title, setTitle] = useState(household.title || '');
  const [floor, setFloor] = useState(household.floor ?? NaN);

  useEffect(() => {
    setTitle(household.title || '');
    setFloor(household.floor ?? NaN);
  }, [household]);

  const nothingHasBeenEdited =
    title == household.title && floor == household.floor;

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited}
          onClick={() => {
            onSave(title, Number.isNaN(floor) ? null : floor);
          }}
          variant="contained"
        >
          Save
        </Button>
      }
      onBack={onBack}
      onClose={onClose}
      title={`Edit ${household.title || 'Untitled household'}`}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSave(title, Number.isNaN(floor) ? null : floor);
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Title"
            onChange={(ev) => setTitle(ev.target.value)}
            value={title}
          />
          <TextField
            fullWidth
            label="Floor"
            onChange={(ev) => setFloor(parseInt(ev.target.value))}
            type="number"
            value={floor}
          />
        </Box>
      </form>
    </PageBase>
  );
};

export default EditHousehold;
