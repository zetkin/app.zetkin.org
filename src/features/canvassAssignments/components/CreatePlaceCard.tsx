import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  TextField,
} from '@mui/material';
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
      <Card sx={{ width: '90%' }}>
        <CardContent>
          <FormControl fullWidth>
            <TextField
              fullWidth
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="title"
              sx={{ paddingTop: 1 }}
            />
          </FormControl>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button onClick={onClose} size="small" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onCreate(title);
              onClose();
            }}
            size="small"
            variant="contained"
          >
            Create place
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
