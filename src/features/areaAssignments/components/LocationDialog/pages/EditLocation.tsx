import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { ZetkinLocation } from 'features/areaAssignments/types';

type EditLocationProps = {
  location: ZetkinLocation;
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
};

const EditLocation: FC<EditLocationProps> = ({
  onClose,
  onBack,
  onSave,
  location,
}) => {
  const [title, setTitle] = useState(location.title || '');
  const [description, setDescription] = useState(location.description || '');

  useEffect(() => {
    setTitle(location.title || '');
    setDescription(location.description || '');
  }, [location]);

  const nothingHasBeenEdited =
    title == location.title &&
    (description == location.description ||
      (!description && !location.description));

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited}
          onClick={() => {
            onSave(title, description);
          }}
          variant="contained"
        >
          Save
        </Button>
      }
      onBack={onBack}
      onClose={onClose}
      title={`Edit ${location.title || 'Untitled place'}`}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSave(title, description);
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} height="100%">
          <TextField
            fullWidth
            label="Edit title"
            onChange={(ev) => setTitle(ev.target.value)}
            value={title}
          />
          <TextField
            fullWidth
            label="Edit description"
            multiline
            onChange={(ev) => setDescription(ev.target.value)}
            rows={5}
            value={description}
          />
        </Box>
      </form>
    </PageBase>
  );
};

export default EditLocation;
