import { Box, TextField } from '@mui/material';
import { FC } from 'react';

type EditPlaceProps = {
  description: string;
  onDescriptionChange: (newDescription: string) => void;
  onTitleChange: (newTitle: string) => void;
  title: string;
};

const EditPlace: FC<EditPlaceProps> = ({
  description,
  onDescriptionChange,
  onTitleChange,
  title,
}) => {
  return (
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
        onChange={(ev) => onTitleChange(ev.target.value)}
      />
      <TextField
        defaultValue={description}
        fullWidth
        label="Edit description"
        multiline
        onChange={(ev) => onDescriptionChange(ev.target.value)}
        rows={5}
      />
    </Box>
  );
};

export default EditPlace;
