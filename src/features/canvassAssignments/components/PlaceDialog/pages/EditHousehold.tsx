import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { Household } from 'features/canvassAssignments/types';

type Props = {
  household: Household;
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string) => void;
};

const EditHousehold: FC<Props> = ({ onClose, onBack, onSave, household }) => {
  const [title, setTitle] = useState(household.title || '');

  useEffect(() => {
    setTitle(household.title || '');
  }, [household]);

  const nothingHasBeenEdited = title == household.title;

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited}
          onClick={() => {
            onSave(title);
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
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        height="100%"
        paddingTop={2}
      >
        <TextField
          defaultValue={title}
          fullWidth
          label="Edit title"
          onChange={(ev) => setTitle(ev.target.value)}
        />
      </Box>
    </PageBase>
  );
};

export default EditHousehold;
