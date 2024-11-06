import { Box, Button, Card, FormControl, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
  card: {
    bottom: 15,
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
}));

type AddPlaceDialogProps = {
  onClose: () => void;
  onCreate: (title: string) => void;
};

export const CreatePlaceCard: FC<AddPlaceDialogProps> = ({
  onClose,
  onCreate,
}) => {
  const classes = useStyles();

  const [title, setTitle] = useState<string>('');

  return (
    <Box className={classes.card}>
      <Card sx={{ p: 1, width: '90%' }}>
        <form
          onSubmit={() => {
            onCreate(title);
            onClose();
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
              <Button
                fullWidth
                onClick={onClose}
                size="small"
                variant="outlined"
              >
                Cancel
              </Button>
            </Box>
            <Box flexBasis={1} flexGrow={1} flexShrink={1}>
              <Button
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
      </Card>
    </Box>
  );
};
