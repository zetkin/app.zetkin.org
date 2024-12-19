import { FC, useState } from 'react';
import { Box, Button, FormControl, TextField } from '@mui/material';

type CreateLocationCardProps = {
  onClose: () => void;
  onCreate: (title: string) => void;
};

export const CreateLocationCard: FC<CreateLocationCardProps> = ({
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState<string>('');

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        if (title) {
          onCreate(title);
          onClose();
        }
      }}
    >
      <FormControl fullWidth>
        <TextField
          fullWidth
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Type a name for the place"
          sx={{ paddingTop: 1 }}
        />
      </FormControl>
      <Box display="flex" gap={1} mt={1}>
        <Box flexBasis={1} flexGrow={1} flexShrink={1}>
          <Button fullWidth onClick={onClose} size="small" variant="outlined">
            Cancel
          </Button>
        </Box>
        <Box flexBasis={1} flexGrow={1} flexShrink={1}>
          <Button
            disabled={!title}
            fullWidth
            onClick={() => {
              onCreate(title);
              onClose();
            }}
            size="small"
            type="submit"
            variant="contained"
          >
            Create place
          </Button>
        </Box>
      </Box>
    </form>
  );
};
