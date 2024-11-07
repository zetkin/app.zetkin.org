import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { ZetkinPlace } from 'features/canvassAssignments/types';

type EditPlaceProps = {
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  place: ZetkinPlace;
};

const EditPlace: FC<EditPlaceProps> = ({ onClose, onBack, onSave, place }) => {
  const [title, setTitle] = useState(place.title || '');
  const [description, setDescription] = useState(place.description || '');

  useEffect(() => {
    setTitle(place.title || '');
    setDescription(place.description || '');
  }, [place]);

  const nothingHasBeenEdited =
    title == place.title &&
    (description == place.description || (!description && !place.description));

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
      title={`Edit ${place.title || 'Untitled place'}`}
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
        <TextField
          defaultValue={description}
          fullWidth
          label="Edit description"
          multiline
          onChange={(ev) => setDescription(ev.target.value)}
          rows={5}
        />
      </Box>
    </PageBase>
  );
};

export default EditPlace;
